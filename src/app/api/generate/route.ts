import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-openai-key-placeholder"
});

// A robust local fallback generator for when OpenAI is unreachable or key is expired
function generateLocalFallback(prompt: string, assistantType: 'designer' | 'finance', activeMemo?: any): any {
  const normalized = prompt.toLowerCase();
  
  if (assistantType === 'designer') {
    if (activeMemo) {
      // Modify active memo
      const updatedMemo = { ...activeMemo };
      let response = "I have updated the active memo to reflect your requested changes.";
      let chart = null;
      
      if (normalized.includes("buy")) {
        updatedMemo.framework = "Scarcity Framework (Upgraded)";
        if (updatedMemo.title) {
          updatedMemo.title = updatedMemo.title.replace(/Avoid|Neutral/gi, "Initiation (Buy Stance)");
        }
        response = "I have upgraded the rating to **Buy** (utilizing the Scarcity framework) and refreshed the memo status.";
      } else if (normalized.includes("neutral") || normalized.includes("avoid")) {
        const rating = normalized.includes("neutral") ? "Neutral" : "Avoid";
        updatedMemo.framework = `${rating} Rating Framework`;
        if (updatedMemo.title) {
          updatedMemo.title = updatedMemo.title.replace(/Buy|Initiation/gi, `${rating} Thesis`);
        }
        response = `I have adjusted the rating stance to **${rating}** based on your comments.`;
      }
      
      if (normalized.includes("risk") || normalized.includes("add") || normalized.includes("tracker") || normalized.includes("bullet")) {
        updatedMemo.tracker = [
          ...(updatedMemo.tracker || []),
          "Regulatory and antitrust compliance monitoring (Added)"
        ];
        response += " I also appended a new risk milestone to your Thesis Tracker.";
      }
      
      if (normalized.includes("author") || normalized.includes("ian")) {
        updatedMemo.author = "Ian McDonald (APM) & Nexus AI";
        response += " I have updated the author credits.";
      }

      if (normalized.includes("chart") || normalized.includes("graph") || normalized.includes("sensitivity")) {
        chart = {
          title: "Valuation Multiple Sensitivity (EV/NTM Revenue)",
          type: "bar",
          labels: ["10% Growth", "20% Growth", "30% Growth", "40% Growth"],
          datasets: [
            {
              label: "Implied EV/NTM Revenue Multiple",
              data: [4.5, 6.8, 10.2, 14.5]
            }
          ]
        };
        response += " I have also rendered a multiple sensitivity chart directly in the chat to support this valuation model.";
      }
      
      updatedMemo.content = updatedMemo.content + " [Thesis updated dynamically via chat feedback regarding risk metrics & valuation parameters].";
      
      return {
        response,
        isEdit: true,
        memo: updatedMemo,
        chart
      };
    }

    let company = "AAPL";
    let title = "Apple Inc. Initiation (Buy Stance)";
    let framework = "Scarcity Framework";
    let content = "Apple's hardware ecosystem remains a resilient physical tether. We see expanding services revenue driving multiple expansion over the long term.";
    let tracker = ["Services margin expansion", "iPhone 18 upgrade cycle", "AI feature adoption rates"];
    let chart = null;

    if (normalized.includes("msft") || normalized.includes("microsoft") || normalized.includes("azure")) {
      company = "MSFT";
      title = "Microsoft Corporation Thesis Refresh";
      framework = "Scale Economies Shared";
      content = "Microsoft's Azure cloud infrastructure continues to scale rapidly, supported by a dominant enterprise software footprint and aggressive AI CapEx.";
      tracker = ["Azure growth acceleration", "Copilot ARR contribution", "AI CapEx efficiency"];
    } else if (normalized.includes("nvda") || normalized.includes("nvidia")) {
      company = "NVDA";
      title = "Nvidia Corp. Thesis Update";
      framework = "Hardware Monopoly / Scarcity";
      content = "Nvidia retains an absolute monopoly on high-end AI compute silicon. Near-term demand remains extremely strong, though long-term CapEx cycles warrant caution.";
      tracker = ["Blackwell production ramp", "Hyperscaler CapEx guidance", "ASIC competitive threats"];
    } else if (normalized.includes("tesla") || normalized.includes("tsla")) {
      company = "TSLA";
      title = "Tesla Inc. Coverage Initiation";
      framework = "Vertical Integration Advantage";
      content = "Tesla's integration across batteries, motors, and full self-driving computing creates a formidable hardware moat, but execution risks in FSD software remain elevated.";
      tracker = ["FSD monetization progress", "Next-gen platform ramp", "Auto gross margin ex-credits"];
    } else if (normalized.includes("amazon") || normalized.includes("amzn")) {
      company = "AMZN";
      title = "Amazon.com Inc. Sector Analysis";
      framework = "Platform Aggregation / Scale Economies";
      content = "AWS growth is stabilizing alongside solid retail operating margin expansion. Logistics efficiencies continue to yield high returns on capital.";
      tracker = ["AWS AI workload revenue", "Retail margin expansion", "Capital expenditure levels"];
    }

    if (normalized.includes("chart") || normalized.includes("graph")) {
      chart = {
        title: `${company} Valuation Sensitivity (EV/NTM Revenue)`,
        type: "bar",
        labels: ["10% Growth", "20% Growth", "30% Growth", "40% Growth"],
        datasets: [
          {
            label: "Implied EV/NTM Revenue Multiple",
            data: [4.5, 6.8, 10.2, 14.5]
          }
        ]
      };
    }

    return {
      response: `I have synthesized the research and generated a premium investment memo for **${company}** based on your request. I added a new node to the knowledge graph and loaded the draft document.`,
      memo: {
        title,
        author: "Nexus AI Analyst",
        date: "Present",
        company,
        framework,
        content,
        tracker
      },
      chart
    };
  } else {
    // Interactive Finance Copilot Fallback
    if (normalized.includes("report") || normalized.includes("memo")) {
      return {
        response: "I have compiled a comprehensive Apple Inc. (AAPL) Financial Performance Report for you. I loaded the structured memo document directly into your Document View on the right, and added a node to the Nexus Graph. Let me know if you would like me to render any specific charts or analyze more data!",
        memo: {
          title: "Apple Inc. Financial Performance Report",
          author: "Nexus AI Analyst",
          date: "Q2 2026",
          company: "AAPL",
          framework: "Financial Analysis Framework",
          content: "Apple's financial profile remains highly robust. Services division operates at a ~74% gross margin and continues to grow double-digits, offsetting mature hardware replacement cycles. The stock represents a cash-generative compounding asset with strong ecosystem lock-in.",
          tracker: ["Operating margins: 30.7%", "Services growth rate: 12.5%", "Ecosystem lock-in: High"]
        },
        chart: {
          title: "Apple Revenue Breakdown ($ Billions)",
          type: "bar",
          labels: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
          datasets: [
            {
              label: "Hardware Revenue",
              data: [63.4, 69.1, 71.3, 65.8]
            },
            {
              label: "Services Revenue",
              data: [22.3, 23.6, 24.0, 24.2]
            }
          ]
        }
      };
    } else if (normalized.includes("apple") || normalized.includes("aapl")) {
      return {
        response: "Apple's financial profile remains highly robust, driven by its high-margin Services division which offsets mature hardware growth. Services revenue reached $24.2B in the recent quarter, growing 12.5% YoY, and operates at a ~74% gross margin compared to ~36% for Hardware. \n\nHere is a visual breakdown of Apple's recent revenue composition showing Services ($B) versus Hardware ($B) across the last four quarters.",
        chart: {
          title: "Apple Revenue Breakdown ($ Billions)",
          type: "bar",
          labels: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
          datasets: [
            {
              label: "Hardware Revenue",
              data: [63.4, 69.1, 71.3, 65.8]
            },
            {
              label: "Services Revenue",
              data: [22.3, 23.6, 24.0, 24.2]
            }
          ]
        }
      };
    } else if (normalized.includes("microsoft") || normalized.includes("msft") || normalized.includes("azure")) {
      return {
        response: "Microsoft's Azure growth has been the core driver of its cloud thesis. Last quarter, Azure grew 31% YoY, with capacity constraints being the only bottleneck. Management guided Azure growth to remain in the 31-33% range, driven by GPU expansions. \n\nHere is the Azure Year-over-Year Revenue Growth rate over the past five quarters, showing a steady acceleration curve as AI workloads scale up.",
        chart: {
          title: "Azure YoY Revenue Growth Rate (%)",
          type: "area",
          labels: ["Q2-25", "Q3-25", "Q4-25", "Q1-26", "Q2-26"],
          datasets: [
            {
              label: "Azure YoY Growth",
              data: [29, 33, 30, 31, 32]
            }
          ]
        }
      };
    } else if (normalized.includes("tesla") || normalized.includes("tsla")) {
      return {
        response: "Tesla's valuation hinges on its ability to sustain margins in automotive while scaling FSD. Auto gross margin (excluding regulatory credits) was a point of concern when it dipped to 14.6%, but has recently shown recovery towards 16.4% due to cost-down initiatives per vehicle.\n\nLet's visualize Tesla's Automotive Gross Margin trend (excluding regulatory credits) to see the progress of their cost-efficiency program.",
        chart: {
          title: "Tesla Automotive Gross Margin (%) (Ex-Credits)",
          type: "line",
          labels: ["Q1-25", "Q2-25", "Q3-25", "Q4-25", "Q1-26"],
          datasets: [
            {
              label: "Auto Gross Margin %",
              data: [18.9, 16.2, 14.6, 15.4, 16.4]
            }
          ]
        }
      };
    } else if (normalized.includes("comparison") || normalized.includes("compare") || normalized.includes("growth") || normalized.includes("graph") || normalized.includes("chart")) {
      return {
        response: "When comparing estimated CY 2026 growth across megacap tech, Nvidia dominates the absolute growth chart, but AWS/Amazon and Microsoft show remarkably high growth rates relative to their scale. Apple remains slower but is highly cash-generative.\n\nHere is the comparative chart of projected CY 2026 YoY revenue growth percentages across these companies.",
        chart: {
          title: "CY 2026 Projected Revenue Growth (%)",
          type: "bar",
          labels: ["AAPL", "MSFT", "GOOGL", "NVDA", "AMZN"],
          datasets: [
            {
              label: "CY26 Projected Growth %",
              data: [7.2, 14.5, 12.8, 38.4, 11.2]
            }
          ]
        }
      };
    } else {
      // General financial advisor responses
      return {
        response: `To analyze your question about "${prompt}", it is helpful to look at how different growth assumptions impact valuation multiples. Under modern buy-side standards, we evaluate companies through their cost of capital against return on invested capital (ROIC). \n\nHere is a sensitivity chart of the EV/NTM Revenue Multiple for a high-quality software business at various growth rates (assuming a constant 10% cost of capital).`,
        chart: {
          title: "Valuation Multiple Sensitivity (EV/NTM Revenue)",
          type: "bar",
          labels: ["10% Growth", "20% Growth", "30% Growth", "40% Growth"],
          datasets: [
            {
              label: "Implied EV/NTM Revenue Multiple",
              data: [4.5, 6.8, 10.2, 14.5]
            }
          ]
        }
      };
    }
  }
}

export async function POST(req: Request) {
  try {
    const { prompt, assistantType = 'designer', activeMemo } = await req.json();

    let systemPrompt = "";
    let schemaDescription = "";

    if (assistantType === 'finance') {
      systemPrompt = `You are the Interactive Finance Copilot. You are a conversational, friendly, but highly analytical financial advisor and colleague (Ian's friend). You help Ian reason about stock valuations, finance questions, macro trends, and data.
      When the user asks a question, provide detailed answers with exact numbers and standards.
      If the response would benefit from a visual graph (like a stock trend, comparison, or breakdown), include a JSON block representing a chart in your response.
      If the user explicitly requests a report or memo (e.g. 'generate a report' or 'give me a report on Apple'), you should ALSO synthesize a structured memo object for their document view.`;
      
      schemaDescription = `Respond with JSON matching this schema:
      {
        "response": "A detailed conversational response with explanations, formatting, numbers, and questions.",
        "chart": {
          "title": "Title of the chart",
          "type": "line" | "bar" | "area" | "pie",
          "labels": ["Label 1", "Label 2", ...],
          "datasets": [
            {
              "label": "Dataset Label",
              "data": [number1, number2, ...]
            }
          ]
        },
        "memo": {
          "title": "A concise title for the newly generated report",
          "author": "Nexus AI Analyst",
          "date": "Present",
          "company": "Company ticker",
          "framework": "Analytical framework",
          "content": "Paragraph content for the report document",
          "tracker": ["Bullet 1", "Bullet 2", ...]
        }
      }
      If no chart is relevant, set the "chart" key to null. If no memo document is being generated, set the "memo" key to null.`;
    } else {
      if (activeMemo) {
        systemPrompt = `You are the NexusFinance AI Analyst. You produce high-end, premium buy-side investment memos.
        The user wants to EDIT or MODIFY an existing memo that is currently loaded.
        Here is the current memo:
        ${JSON.stringify(activeMemo)}
        
        Modify and update this memo based on the user's prompt (e.g. changing ratings, adding risk factors, editing metrics, author credits, etc.). Keep the overall schema intact. Set "isEdit" to true in your JSON output.
        If the user asks to see a chart, graph, or sensitivity table, include a chart block in the JSON response to show it inline.`;
        
        schemaDescription = `Respond with JSON matching this schema:
        {
          "response": "A friendly confirmation detailing exactly what updates or edits were made to the memo.",
          "isEdit": true,
          "memo": {
            "title": "Memo Title (updated if needed)",
            "author": "Author (updated if needed)",
            "date": "Present",
            "company": "Company",
            "framework": "Framework or rating stance (updated if needed)",
            "content": "Paragraph content incorporating the edits",
            "tracker": ["Updated bullet point 1", "Updated bullet point 2", ...]
          },
          "chart": {
            "title": "Title of the chart (optional)",
            "type": "line" | "bar" | "area" | "pie",
            "labels": ["Label 1", "Label 2", ...],
            "datasets": [
              {
                "label": "Dataset Label",
                "data": [number1, number2, ...]
              }
            ]
          }
        }
        If no chart is requested, set "chart" to null.`;
      } else {
        systemPrompt = `You are the NexusFinance AI Analyst. You produce high-end, premium buy-side investment memos.
        If the user asks for a chart, include it in your response JSON under the 'chart' key.`;
        schemaDescription = `Respond with JSON matching this schema:
        {
          "response": "A professional message confirming what you generated, addressing the user.",
          "memo": {
            "title": "A concise, professional title for the memo",
            "author": "Nexus AI Analyst",
            "date": "Present",
            "company": "The primary entity or sector discussed",
            "framework": "The mental model or framework used (e.g., Scale Economies, Scarcity, Capital Cycle)",
            "content": "A detailed, insightful paragraph containing the core thesis.",
            "tracker": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
          },
          "chart": {
            "title": "Title of the chart (optional)",
            "type": "line" | "bar" | "area" | "pie",
            "labels": ["Label 1", "Label 2", ...],
            "datasets": [
              {
                "label": "Dataset Label",
                "data": [number1, number2, ...]
              }
            ]
          }
        }
        If no chart is relevant, set the "chart" key to null.`;
      }
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `${systemPrompt}\n\n${schemaDescription}`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" }
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return NextResponse.json(result);
    } catch (apiError) {
      console.warn("OpenAI API call failed, using fallback generator:", apiError);
      const fallbackResult = generateLocalFallback(prompt, assistantType, activeMemo);
      return NextResponse.json(fallbackResult);
    }

  } catch (error: any) {
    console.error("Endpoint Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
