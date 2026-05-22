"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import * as THREE from 'three';

const ForceGraph3D = dynamic(() => import("react-force-graph-3d"), { ssr: false });

export default function GraphView({ data, onNodeClick, activeMemoId }: any) {
  const fgRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      if (wrapperRef.current) {
        setDimensions({ width: wrapperRef.current.clientWidth, height: wrapperRef.current.clientHeight });
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    
    // Slow auto-rotation for premium feel
    let angle = 0;
    const interval = setInterval(() => {
      if (fgRef.current) {
        fgRef.current.cameraPosition({
          x: 300 * Math.sin(angle),
          z: 300 * Math.cos(angle)
        });
        angle += Math.PI / 2500;
      }
    }, 15);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

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
    <div ref={wrapperRef} style={{ width: '100%', height: '100%', background: 'transparent' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="rgba(0,0,0,0)"
        showNavInfo={false}
        nodeRelSize={6}
        
        // Premium Fiber-Optic Connections
        linkWidth={0.5} // Extremely thin, delicate base lines
        linkColor={() => "rgba(56, 189, 248, 0.15)"} // Subtle sky blue lines
        linkDirectionalParticles={4} // More particles for better flow
        linkDirectionalParticleWidth={2} // Brighter, thicker particles
        linkDirectionalParticleSpeed={0.008} // Faster flow
        linkDirectionalParticleColor={() => "#38bdf8"} // Glowing sky blue particles
        
        // High-Definition Perfectly Round Nodes
        nodeThreeObject={(node: any) => {
          const isHighlighted = node.memoId === activeMemoId;
          const color = getNodeColor(node);
          
          // 32x32 segments guarantees perfectly smooth spheres (no polygons)
          const geometry = new THREE.SphereGeometry(isHighlighted ? 12 : 7, 32, 32);
          const material = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: isHighlighted ? 1 : 0.9,
            shininess: 150,
            emissive: color,
            emissiveIntensity: isHighlighted ? 0.8 : 0.5
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          
          if (isHighlighted) {
            const light = new THREE.PointLight(color, 2, 150);
            mesh.add(light);
          }

          return mesh;
        }}
        
        onNodeClick={(node: any) => {
          onNodeClick(node);
          const distance = 80;
          const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
          if (fgRef.current) {
            fgRef.current.cameraPosition(
              { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
              node,
              1200
            );
          }
        }}
        onNodeHover={(node: any) => {
          if (wrapperRef.current) {
            const canvas = wrapperRef.current.querySelector("canvas");
            if (canvas) {
              canvas.style.cursor = node ? "pointer" : "default";
            }
          }
        }}
      />
    </div>
  );
}
