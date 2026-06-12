"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from 'three';
import SpriteText from 'three-spritetext';

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

export default function GraphView({ 
  data, 
  onNodeClick, 
  activeMemoId, 
  mode = '3d', 
  activeMobileView, 
  isGraphFullscreen 
}: any) {
  const fgRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [isRotating, setIsRotating] = useState(true);

  // Auto-resize graph when wrapper bounds or view active states shift
  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        setDimensions({ 
          width: wrapperRef.current.clientWidth, 
          height: wrapperRef.current.clientHeight 
        });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    // Trigger a delayed resize to catch transitions ending (e.g. mobile tab toggles)
    const timer = setTimeout(handleResize, 150);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [activeMobileView, isGraphFullscreen, mode]);

  useEffect(() => {
    let angle = 0;
    let interval: any;
    
    if (isRotating) {
      interval = setInterval(() => {
        if (fgRef.current && fgRef.current.cameraPosition) {
          fgRef.current.cameraPosition({
            x: 300 * Math.sin(angle),
            z: 300 * Math.cos(angle)
          });
          angle += Math.PI / 2500;
        }
      }, 15);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRotating]);

  const getNodeColor = (node: any) => {
    if (node.memoId && node.memoId === activeMemoId) return "#ffffff"; // White highlight
    switch (node.group) {
      case "company": return "#6366f1"; // Indigo
      case "sector": return "#8b5cf6"; // Violet
      case "memo": return "#d946ef"; // Fuchsia
      case "theme": return "#06b6d4"; // Cyan
      case "framework": return "#3b82f6"; // Blue
      default: return "#6b7280";
    }
  };

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%', background: 'transparent', position: 'relative' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        showNavInfo={false}
        nodeRelSize={6}
        
        // Premium fiber-optic particle flows
        linkWidth={0.5}
        linkColor={() => "rgba(56, 189, 248, 0.15)"}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleSpeed={0.008}
        linkDirectionalParticleColor={() => "#38bdf8"}
        
        // Custom 3D Nodes rendering with Sphere & Conditional SpriteText Label
        nodeThreeObject={(node: any) => {
          const isHighlighted = node.memoId && node.memoId === activeMemoId;
          const isHovered = hoveredNode && hoveredNode.id === node.id;
          
          // In full 3D network, show labels only when hovered/highlighted to avoid clutter
          // In Transmission mode (filtered subset), show all labels permanently
          const shouldShowLabel = mode === 'transmission' || isHighlighted || isHovered;
          const color = getNodeColor(node);
          
          const group = new THREE.Group();
          
          // 1. Sphere Mesh
          const geometry = new THREE.SphereGeometry(isHighlighted ? 10 : 6, 24, 24);
          const material = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: isHighlighted ? 1 : 0.85,
            shininess: 120,
            emissive: color,
            emissiveIntensity: isHighlighted ? 0.8 : 0.4
          });
          const mesh = new THREE.Mesh(geometry, material);
          group.add(mesh);
          
          if (isHighlighted) {
            const light = new THREE.PointLight(color, 2, 100);
            mesh.add(light);
          }
          
          // 2. Floating text label using three-spritetext
          if (shouldShowLabel) {
            const label = node.name || node.id;
            const sprite = new SpriteText(label);
            sprite.color = '#ffffff';
            sprite.textHeight = 6;
            sprite.position.y = 12; // Floating above the sphere
            sprite.backgroundColor = 'rgba(10, 10, 20, 0.85)';
            sprite.padding = [3, 2];
            sprite.borderRadius = 4;
            sprite.borderWidth = 0.5;
            sprite.borderColor = color;
            group.add(sprite);
          }

          return group;
        }}
        
        onNodeClick={(node: any) => {
          onNodeClick(node);
          const distance = 80;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
          if (fgRef.current && fgRef.current.cameraPosition) {
            fgRef.current.cameraPosition(
              { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
              node,
              1200
            );
          }
        }}
        onNodeHover={(node: any) => {
          setHoveredNode(node);
          if (fgRef.current) {
            fgRef.current.refresh();
          }
          if (wrapperRef.current) {
            const canvas = wrapperRef.current.querySelector("canvas");
            if (canvas) {
              canvas.style.cursor = node ? "pointer" : "default";
            }
          }
        }}
      />

      {/* Play/Pause Auto-Rotation Overlay Control */}
      <button 
        onClick={() => setIsRotating(!isRotating)}
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          background: 'rgba(10, 10, 20, 0.85)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          color: '#ffffff',
          padding: '8px 14px',
          fontSize: '12px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 5,
          transition: 'all 0.2s',
          outline: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}
        className="rotation-toggle-btn"
        title={isRotating ? "Pause Auto-Rotation" : "Resume Auto-Rotation"}
      >
        <span style={{ fontSize: '10px' }}>{isRotating ? "⏸️" : "▶️"}</span>
        <span>{isRotating ? "Pause Rotation" : "Play Rotation"}</span>
      </button>
    </div>
  );
}
