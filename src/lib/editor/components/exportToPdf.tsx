import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Descendant, Text, Element as SlateElement } from "slate";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Function to render actual charts in the export container
const renderCharts = async (container: HTMLElement) => {
  // Find all chart placeholders
  const chartPlaceholders = container.querySelectorAll(".chart-visualization");

  console.log(`Found ${chartPlaceholders.length} chart placeholders to render`);

  // Create a promise for each chart rendering
  const renderPromises = Array.from(chartPlaceholders).map(
    async (placeholder, index) => {
      const chartElement = placeholder as HTMLElement;
      const chartType = chartElement.getAttribute("data-chart-type") || "bar";
      const chartDataStr = chartElement.getAttribute("data-chart-data");

      // Get the width and height directly from attributes or style
      const chartWidth =
        parseInt(chartElement.getAttribute("data-width") || "0") ||
        parseInt(chartElement.style.width) ||
        300;
      const chartHeight =
        parseInt(chartElement.getAttribute("data-height") || "0") ||
        parseInt(chartElement.style.height) ||
        300;

      if (!chartDataStr) {
        console.warn("No chart data found for chart", index);
        return;
      }

      try {
        // Parse the chart data
        const chartData = JSON.parse(chartDataStr);

        console.log(
          `Rendering chart ${index} of type ${chartType} with dimensions ${chartWidth}x${chartHeight}`
        );

        // Create a canvas for the chart with exact dimensions
        const canvas = document.createElement("canvas");
        const pixelRatio = 4; // Use device pixel ratio or default to 2 for high quality
        const canvasWidth = chartWidth * pixelRatio;
        const canvasHeight = chartHeight * pixelRatio;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.width = `${chartWidth}px`;
        canvas.style.height = `${chartHeight}px`;
        canvas.style.maxWidth = "100%"; // Allow scaling down if needed

        // Replace the placeholder with the canvas
        chartElement.innerHTML = "";
        chartElement.appendChild(canvas);

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(pixelRatio, pixelRatio);
        }

        // Parse chart options from the data
        const chartOptionsStr = chartElement.getAttribute("data-chart-options");
        let originalChartOptions = {};
        try {
          if (chartOptionsStr) {
            originalChartOptions = JSON.parse(chartOptionsStr);
          }
        } catch (error) {
          console.warn("Failed to parse chart options:", error);
        }

        // Extract datalabels options for reuse
        const datalabelsOptions =
          (originalChartOptions as any)?.plugins?.datalabels || {};

        // Create and render the chart with improved quality settings
        new Chart(canvas, {
          type: chartType as any,
          data: chartData,
          plugins: [ChartDataLabels], // Register the datalabels plugin
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: false,
            devicePixelRatio: pixelRatio, // Use higher device pixel ratio
            plugins: {
              legend: {
                display: true,
                position: "top",
                labels: {
                  font: {
                    size: 14 * pixelRatio, // 더 큰 폰트 크기
                    family: "Arial, sans-serif", // 글꼴 명시
                  },
                  padding: (10 * pixelRatio) / 4, // 패딩 비율 조정
                },
              },
              tooltip: {
                enabled: false, // Disable tooltips for PDF export
              },
              datalabels: {
                display: true,
                color: "#000000",
                font: {
                  size: 12 * pixelRatio, // PDF 화질에 맞게 폰트 크기 조정
                  weight: "bold",
                  family: "Arial, sans-serif",
                },
                align: "center",
                anchor: "center",
                offset: 0,
                formatter: (value: number, context: any) => {
                  // Extract format options from original chart options
                  const format = datalabelsOptions.format || "number";
                  const prefix = datalabelsOptions.prefix || "";
                  const postfix = datalabelsOptions.postfix || "";
                  const decimals = datalabelsOptions.decimals || 2;
                  const digits = datalabelsOptions.digits || 0;

                  let formattedValue: string | number = value;

                  // 숫자 단위 적용
                  let divider = 1;
                  let unitSuffix = "";

                  switch (digits) {
                    case 1: // 천 단위
                      divider = 1000;
                      unitSuffix = "K";
                      break;
                    case 2: // 백만 단위
                      divider = 1000000;
                      unitSuffix = "M";
                      break;
                    case 3: // 십억 단위
                      divider = 1000000000;
                      unitSuffix = "B";
                      break;
                  }

                  // 단위 변환 적용
                  if (divider > 1) {
                    formattedValue = value / divider;
                  }

                  // 포맷 적용
                  switch (format) {
                    case "percent":
                      const total = context.dataset.data.reduce(
                        (sum: number, val: number) => sum + val,
                        0
                      );
                      formattedValue = ((value / total) * 100).toFixed(
                        decimals
                      );
                      if (!postfix && unitSuffix === "") {
                        unitSuffix = "%";
                      }
                      break;
                    case "currency":
                      formattedValue = new Intl.NumberFormat("ko-KR", {
                        style: "currency",
                        currency: "KRW",
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals,
                      }).format(formattedValue as number);
                      // 이미 통화 형식에 포함된 경우 단위 접미사는 추가하지 않음
                      unitSuffix = "";
                      break;
                    case "number":
                      formattedValue = new Intl.NumberFormat("ko-KR", {
                        minimumFractionDigits: decimals,
                        maximumFractionDigits: decimals,
                      }).format(formattedValue as number);
                      break;
                    default:
                      formattedValue = (formattedValue as number).toFixed(
                        decimals
                      );
                  }

                  return `${prefix}${formattedValue}${unitSuffix}${postfix}`;
                },
                // Override with original datalabels options if they exist
                ...(datalabelsOptions.display !== undefined && {
                  display: datalabelsOptions.display,
                }),
                ...(datalabelsOptions.align && {
                  align: datalabelsOptions.align,
                }),
                ...(datalabelsOptions.anchor && {
                  anchor: datalabelsOptions.anchor,
                }),
                ...(datalabelsOptions.offset !== undefined && {
                  offset: datalabelsOptions.offset,
                }),
                ...(datalabelsOptions.color && {
                  color: datalabelsOptions.color,
                }),
              },
            },
            elements: {
              line: {
                borderWidth: 2.5, // 더 굵은 선
                tension: 0.4, // 부드러운 곡선
              },
              point: {
                radius: 5, // 더 큰 점
                hoverRadius: 5,
                borderWidth: 2, // 테두리 굵기
              },
              arc: {
                borderWidth: 2, // 원형 차트 테두리
              },
              bar: {
                borderWidth: 1, // 바 차트 테두리
              },
            },
            scales: {
              x: {
                ticks: {
                  font: {
                    size: 12 * pixelRatio, // 비율에 맞게 조정된 폰트 크기
                    family: "Roboto, sans-serif",
                  },
                  padding: 8, // 더 넓은 패딩
                },
                grid: {
                  display: true,
                  lineWidth: 1.2, // 그리드 선 두께
                  color: "rgba(0,0,0,0.05)", // Lighter grid lines
                },
              },
              y: {
                ticks: {
                  font: {
                    size: 12 * pixelRatio,
                    family: "Roboto, sans-serif",
                  },
                  padding: 8,
                },
                grid: {
                  display: true,
                  lineWidth: 1.2, // 그리드 선 두께
                  color: "rgba(0,0,0,0.05)", // Lighter grid lines
                },
              },
            },
          },
        });

        console.log(`Successfully rendered chart ${index}`);
      } catch (error) {
        console.error("Error rendering chart:", error);
        chartElement.innerHTML = `<div style="color: red; text-align: center; width: 100%; height: 100%;">
          <p>Chart rendering failed</p>
        </div>`;
      }
    }
  );

  // Wait for all charts to render
  await Promise.all(renderPromises);
};

const slateToHtml = (nodes: Descendant[]): string => {
  let html = "";

  const processNode = (node: any): string => {
    // Text node - explicitly check if it's a text node by looking for 'text' property
    if (Text.isText(node)) {
      let text = node.text;

      // 빈 텍스트에 대한 처리 - 최소한 공백 하나를 추가하여 HTML에서 높이를 유지
      if (text === "") {
        text = "\u00A0"; // 공백 문자 (non-breaking space)
      } else {
        // 줄바꿈 문자를 <br> 태그로 변환 (HTML 이스케이프 전에 처리)
        text = text.replace(/\n/g, "<br>");
      }

      // Escape HTML entities to prevent breaking the output
      text = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

      // <br> 태그 복원 (이스케이프된 것을 다시 태그로)
      text = text.replace(/&lt;br&gt;/g, "<br>");

      // Apply text formatting (order matters for nested formatting)
      // Important: Apply code formatting first before other styling
      if (node.code) {
        text = `<code class="inline-code">${text}</code>`;
      }

      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      if (node.underline) text = `<u>${text}</u>`;
      if (node.strikethrough) text = `<s>${text}</s>`;
      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      if (node.underline) text = `<u>${text}</u>`;
      if (node.strikethrough) text = `<s>${text}</s>`;

      return text;
    }

    // Element nodes - make sure it has children before processing
    if (!node.children) {
      console.warn("Node without children found:", node);
      return "";
    }

    const children = node.children.map(processNode).join("");

    // Determine alignment style if present
    const align = node.align ? ` style="text-align: ${node.align}"` : "";

    switch (node.type) {
      case "paragraph":
        // Preserve any newline characters by using white-space: pre-wrap in the style
        return `<p${align} style="white-space: pre-wrap !important; ${
          align ? `text-align: ${node.align};` : ""
        }">${children || "\u00A0"}</p>`;

      case "heading-one":
        return `<h1${align}>${children}</h1>`;

      case "heading-two":
        return `<h2${align}>${children}</h2>`;

      case "block-quote":
        return `<blockquote${align}>${children}</blockquote>`;

      case "code-block":
        return `<pre${align}><code class="code-block">${children}</code></pre>`;

      case "numbered-list":
        return `<ol${align}>${children}</ol>`;

      case "bulleted-list":
        return `<ul${align}>${children}</ul>`;

      case "list-item":
        return `<li${align}>${children}</li>`;

      case "image":
        return `<div${align}><img src="${node.url}" alt="Image" style="max-width: 100%;" /></div>`;

      case "table":
        return `<table border="1" style="border-collapse: collapse; width: 100%;">${children}</table>`;

      case "table-row":
        return `<tr>${children}</tr>`;

      case "table-cell":
        return `<td style="padding: 8px;">${children}</td>`;

      case "link":
        return `<a href="${node.url}" target="_blank" rel="noopener noreferrer">${children}</a>`;

      case "button":
        return `<span class="button-element" style="display: inline-block; padding: 4px 8px; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 4px;">${children}</span>`;

      case "badge":
        return `<span class="badge-element" style="display: inline-block; padding: 2px 6px; background-color: green; color: white; border-radius: 4px; font-size: 0.9em;">${children}</span>`;

      //   case "chart-block":
      //     // Handle different chart layouts
      //     const layout = node.layout || "full";
      //     let chartBlockStyle = "";

      //     switch (layout) {
      //       case "full":
      //         chartBlockStyle =
      //           "display: flex; flex-direction: column; align-items: center; width: 100%;";
      //         break;
      //       case "left":
      //         chartBlockStyle =
      //           "display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start;";
      //         break;
      //       case "right":
      //         chartBlockStyle =
      //           "display: flex; flex-direction: row-reverse; justify-content: space-between; align-items: flex-start;";
      //         break;
      //       case "center":
      //         chartBlockStyle =
      //           "display: flex; justify-content: center; align-items: center;";
      //         break;
      //     }

      //     return `<div class="chart-container" style="${chartBlockStyle} border: 1px solid #eee; padding: 15px; margin: 15px 0; border-radius: 4px;">${children}</div>`;
      case "chart-block": {
        // Handle different chart layouts
        const layout = node.layout || "full";
        let chartBlockStyle = "";
        let containerClasses = "chart-container";

        // Use fixed styles matching the editor view
        switch (layout) {
          case "full":
            chartBlockStyle =
              "display: flex; flex-direction: column; align-items: center; width: 100%; box-sizing: border-box; min-height: 200px; margin-bottom: 24px;";
            containerClasses += " chart-layout-full";
            break;
          case "left":
            chartBlockStyle =
              "display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start; width: 100%; box-sizing: border-box; gap: 16px; min-height: 200px; margin-bottom: 24px;";
            containerClasses += " chart-layout-left";
            break;
          case "right":
            chartBlockStyle =
              "display: flex; flex-direction: row-reverse; justify-content: space-between; align-items: flex-start; width: 100%; box-sizing: border-box; gap: 16px; min-height: 200px; margin-bottom: 24px;";
            containerClasses += " chart-layout-right";
            break;
          case "center":
            chartBlockStyle =
              "display: flex; flex-direction: row; justify-content: space-between; align-items: flex-start; width: 100%; box-sizing: border-box; gap: 16px; min-height: 200px; margin-bottom: 24px;";
            containerClasses += " chart-layout-center";
            break;
        }

        // Process children with appropriate wrappers based on layout
        let wrappedChildren = "";
        const childrenArr = node.children || [];

        childrenArr.forEach((child: any, index: number) => {
          let childStyle = "";
          let childClass = "";

          if (layout === "right") {
            // First child in right layout (text)
            if (index === 0) {
              childStyle =
                "flex: 1; max-width: 48%; box-sizing: border-box; padding-right: 10px;";
              childClass = "chart-text left-text";
            } else {
              // Chart in right layout
              childStyle =
                "flex: 2; display: flex; justify-content: center; align-items: center; width: 48%; box-sizing: border-box;";
              childClass = "chart-visual";
            }
          } else if (layout === "left") {
            // First child is chart in left layout
            if (index === 0) {
              childStyle =
                "flex: 2; display: flex; justify-content: center; align-items: center; width: 48%; box-sizing: border-box;";
              childClass = "chart-visual";
            } else {
              // Text in left layout
              childStyle =
                "flex: 1; max-width: 48%; box-sizing: border-box; padding-left: 10px;";
              childClass = "chart-text right-text";
            }
          } else if (layout === "center") {
            if (index === 0) {
              // Left text
              childStyle =
                "flex: 1; width: 24%; box-sizing: border-box; padding-right: 10px;";
              childClass = "chart-text left-text";
            } else if (index === 1) {
              // Chart in center
              childStyle =
                "flex: 2; display: flex; justify-content: center; align-items: center; width: 48%; box-sizing: border-box;";
              childClass = "chart-visual";
            } else {
              // Right text
              childStyle =
                "flex: 1; width: 24%; box-sizing: border-box; padding-left: 10px;";
              childClass = "chart-text right-text";
            }
          } else {
            // Default flex for full layout
            childStyle = "width: 100%; box-sizing: border-box;";
            childClass = index === 0 ? "chart-visual" : "chart-text";
          }

          const childHtml = processNode(child);
          wrappedChildren += `<div class="${childClass}" style="${childStyle}">${childHtml}</div>`;
        });

        return `<div class="${containerClasses}" style="${chartBlockStyle}">${wrappedChildren}</div>`;
      }
      case "chart": {
        // Use exact width and height from the editor
        const chartWidth = node.width || 300;
        const chartHeight = node.height || 300;
        const chartData = JSON.stringify(node.data || {});
        const chartOptions = JSON.stringify(node.options || {});
        const chartType = node.chartType || "bar";

        return `<div class="chart-visualization" 
              style="width: ${chartWidth}px; height: ${chartHeight}px; background-color: #f9f9f9; border-radius: 4px; min-width: 300px; overflow: hidden;"
              data-chart-type="${chartType}"
              data-chart-data='${chartData}'
              data-chart-options='${chartOptions}'
              data-width="${chartWidth}"
              data-height="${chartHeight}">
            <div style="text-align: center; color: #666; padding: 20px;">
              <p style="margin: 0; font-weight: bold;">${chartType}</p>
              <p style="margin: 5px 0; font-size: 0.9em;">Chart will be rendered during export</p>
            </div>
          </div>`;
      }

      default:
        // For unknown types, return the children wrapped in a div
        console.warn(`Unknown node type: ${node.type}`, node);
        return `<div${align}>${children}</div>`;
    }
  };

  // Process each top-level node
  for (const node of nodes) {
    try {
      html += processNode(node);
    } catch (error) {
      console.error("Error processing node:", node, error);
      html +=
        '<div style="color: red; padding: 10px; background-color: #fff0f0; border: 1px solid #ffcccc; border-radius: 4px; margin: 10px 0;">Error rendering content</div>';
    }
  }

  return html;
};

// Function to export content as PDF
const exportToPdf = async (title: string, content: Descendant[]) => {
  // Create a temporary container for the content

  const contentWidth = 800;

  const container = document.createElement("div");
  container.className = "pdf-export-container";
  container.style.width = `${contentWidth}px`;
  container.style.padding = "28px";
  container.style.width = "210mm"; // A4 width
  container.style.margin = "0 auto";
  container.style.fontSize = "11pt";
  container.style.fontFamily = "Roboto, sans-serif";
  container.style.backgroundColor = "white";
  container.style.position = "absolute";
  container.style.left = "-9999px"; // Position off-screen
  container.style.top = "0";

  // Add title
  //   const titleElement = document.createElement("h1");
  //   titleElement.textContent = title;
  //   titleElement.style.marginBottom = "20px";
  //   titleElement.style.textAlign = "center";
  //   container.appendChild(titleElement);

  // Add styling for PDF
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    body, html {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  .pdf-export-container {
    background-color: white !important;
    color: black;
    max-width: ${contentWidth}px;
    width: ${contentWidth}px;
    box-sizing: border-box;
  }
  
  .slate-content-export {
    width: 100%;
    box-sizing: border-box;
  }
    textarea {
  font-family: "Roboto", sans-serif;
  line-height: 1.4;
  background: #eee;
}

  
  img { max-width: 100%; height: auto; }
  table { width: 100%; border-collapse: collapse; margin: 15px 0; }
  td, th { border: 1px solid #ddd; padding: 8px; }
  blockquote {
  border-left: 2px solid #ddd;
  margin-left: 0;
  margin-right: 0;
padding-top: 1em;
  padding-left: 10px;
  color: #aaa;
  font-style: italic;
}


blockquote p {
  margin: 0 !important;
  padding: 0 !important;
  display: block !important;
  position: relative !important;
}

blockquote::before {
  content: '' !important;
  display: table !important;
}

blockquote::after {
  content: '' !important;
  display: table !important;
  clear: both !important;
}
  h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.2;
  color: #111827;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  color: #1f2937;
}

h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  color: #374151;
}

/* Text formatting styles */
em {
  font-style: italic;
  color: inherit;
}

strong {
  font-weight: 700;
  color: inherit;
}

u {
  text-decoration: underline;
}


code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9em;
  white-space: pre-wrap;
}

/* Inline code specific styling */
.inline-code {
  background-color: #f0f0f0;
  padding: 2px 4px;
  margin: auto;
  border-radius: 3px;
  color: #333;
  font-size: 0.9em;
  display: inline;
  line-height: 1.9 !important; 
  white-space: pre-wrap;
  display: inline;

}



/* Code block specific styling */
pre {
  background-color: #f4f4f4;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  overflow-x: auto;
  margin: 10px 0;
  line-height: 1.5;
}

pre > code.code-block {
  background-color: transparent;
  padding: 0;
  border: none;
  display: block;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9em;
  color: #333;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* Fix any nested formatting issues */
code strong,
code em,
code u,
code s {
  /* Preserve code font in formatted text */
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

p {
  margin: 8px 0;
  line-height: 1.5;
  white-space: pre-wrap !important; /* Preserve line breaks */
}
ol {
  padding-left: 2em;
  margin: 0.5em 0;
  list-style-type: decimal;
}

ul {
  padding-left: 2em;
  margin: 0.5em 0;
  list-style-type: disc;
}

li {
  padding: 0.25em 0;
  line-height: 1.5;
}

/* Nested lists */
li > ol,
li > ul {
  margin: 0.25em 0;
}
  
  /* Chart container styling */
  .chart-container { 
    page-break-inside: avoid;
    margin: 20px 0; 
    width: 100% !important;
    display: flex;
    min-height: 200px;
  }
    p, div, span { 
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
  }
  
  /* Layout specific styles */
  .chart-layout-full { 
    flex-direction: column !important; 
    align-items: center !important;
  }
  .chart-layout-left { 
    flex-direction: row !important;
    justify-content: space-between !important;
    gap: 16px !important;
  }
  .chart-layout-right { 
    flex-direction: row-reverse !important;
    justify-content: space-between !important;
    gap: 16px !important;
  }
  .chart-layout-center { 
    flex-direction: row !important;
    justify-content: space-between !important;
    gap: 16px !important;
  }
  
  /* Chart visual and text elements */
  .chart-visual { 
    display: flex !important; 
    justify-content: center !important; 
    align-items: center !important;
  }
  
  /* Full layout styling */
  .chart-layout-full .chart-visual,
  .chart-layout-full .chart-text {
    width: 100% !important;
  }
  
  /* Left/Right layout styling */
  .chart-layout-left .chart-visual,
  .chart-layout-right .chart-visual {
    flex: 2 !important;
    width: 48% !important;
  }
  
  .chart-layout-left .chart-text,
  .chart-layout-right .chart-text {
    flex: 1 !important;
    width: 48% !important;
    max-width: 48% !important;
  }
  
  /* Center layout styling */
  .chart-layout-center .chart-visual {
    flex: 2 !important;
    width: 48% !important;
  }
  
  .chart-layout-center .left-text,
  .chart-layout-center .right-text {
    flex: 1 !important;
    width: 24% !important;
  }
  canvas { max-width: 100%; }
  .chart-visualization { margin: 10px 0; }

  /* Improve chart text handling */
  .chart-text p {
    white-space: pre-wrap !important; /* Preserve line breaks */
    margin: 0 0 8px 0 !important;
  }
  
  .chart-text br {
    display: block !important;
    content: "" !important;
    margin-top: 8px !important;
  }
  
  /* Additional chart layout preservation */
  .chart-layout-full, 
  .chart-layout-left, 
  .chart-layout-right, 
  .chart-layout-center {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
  
  /* Better chart text container styling */
  .chart-text {
    overflow-wrap: break-word !important;
    word-wrap: break-word !important;
  }
`;
  container.appendChild(styleElement);

  // Convert Slate content to HTML and add to container
  try {
    const contentHtml = slateToHtml(content);
    const contentDiv = document.createElement("div");
    contentDiv.className = "slate-content-export";
    contentDiv.innerHTML = contentHtml;

    // 모든 문단에 대해 줄바꿈 처리 개선
    const paragraphs = contentDiv.querySelectorAll("p");
    paragraphs.forEach((paragraph) => {
      // 빈 단락 처리
      if (paragraph.innerHTML.trim() === "") {
        paragraph.innerHTML = "&nbsp;";
      }

      // 줄바꿈 처리
      const html = paragraph.innerHTML;
      if (html.includes("\n")) {
        paragraph.innerHTML = html.replace(/\n/g, "<br>");
      }
    });

    // Process line breaks in chart text blocks before adding to container
    const processLineBreaks = () => {
      const chartTextBlocks = contentDiv.querySelectorAll(".chart-text");
      chartTextBlocks.forEach((textBlock) => {
        // Find all paragraphs within chart text blocks
        const paragraphs = textBlock.querySelectorAll("p");
        paragraphs.forEach((paragraph) => {
          // 빈 내용 처리
          if (paragraph.innerHTML.trim() === "") {
            paragraph.innerHTML = "&nbsp;";
          }

          // Replace \n with <br> tags for proper HTML rendering
          const html = paragraph.innerHTML;
          if (html.includes("\n")) {
            paragraph.innerHTML = html.replace(/\n/g, "<br>");
          }
        });
      });
    };

    // Process line breaks before adding to container
    processLineBreaks();

    container.appendChild(contentDiv);

    // Add to document temporarily
    document.body.appendChild(container);

    // Render actual charts in the container
    await renderCharts(container);

    // Wait for a short time to ensure charts are fully rendered
    await new Promise((resolve) => setTimeout(resolve, 500));
  } catch (error) {
    console.error("Error converting content to HTML:", error);
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML =
      '<p style="color: red; padding: 10px; background-color: #fff0f0; border: 1px solid #ffcccc; border-radius: 4px;">Error converting document content</p>';
    container.appendChild(errorDiv);
    document.body.appendChild(container);
  }

  try {
    // Convert the HTML to a canvas with better settings for PDF quality
    const canvas = await html2canvas(container, {
      scale: 4, // Higher scale for better quality
      useCORS: true,
      logging: false, // Enable logging for debugging
      allowTaint: true,
      backgroundColor: "#FFFFFF",
      imageTimeout: 15000, // Longer timeout for images
      width: contentWidth, // Set fixed width to match container
      onclone: (clonedDoc) => {
        // Additional processing on the cloned document if needed
        const clonedContainer = clonedDoc.body.querySelector(
          ".pdf-export-container"
        ) as HTMLElement;
        if (clonedContainer) {
          clonedContainer.style.position = "static";
          clonedContainer.style.left = "0";
          clonedContainer.style.width = `${contentWidth}px`;

          // Process code blocks to ensure proper formatting
          const codeBlocks = clonedContainer.querySelectorAll(
            "pre code.code-block"
          );
          codeBlocks.forEach((codeBlock) => {
            // Ensure code blocks maintain whitespace and don't break layout
            (codeBlock as HTMLElement).style.whiteSpace = "pre-wrap";
            (codeBlock as HTMLElement).style.wordBreak = "break-word";
            (codeBlock as HTMLElement).style.fontFamily =
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
            (codeBlock as HTMLElement).style.display = "block";
            (codeBlock.parentElement as HTMLElement).style.backgroundColor =
              "#f4f4f4";
            (codeBlock.parentElement as HTMLElement).style.padding = "12px";
            (codeBlock.parentElement as HTMLElement).style.borderRadius = "4px";
          });

          // Process inline code elements
          const inlineCodeElements =
            clonedContainer.querySelectorAll("code.inline-code");
          inlineCodeElements.forEach((codeElement) => {
            (codeElement as HTMLElement).style.backgroundColor = "#f0f0f0";
            (codeElement as HTMLElement).style.padding = "2px 4px";
            (codeElement as HTMLElement).style.borderRadius = "3px";
            (codeElement as HTMLElement).style.fontFamily =
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
            (codeElement as HTMLElement).style.fontSize = "0.9em";
            (codeElement as HTMLElement).style.display = "inline";
            (codeElement as HTMLElement).style.whiteSpace = "pre-wrap";
          });

          const allCodeElements = clonedContainer.querySelectorAll("code");
          allCodeElements.forEach((codeElement) => {
            // Remove any duplicate nested inline elements within code
            const nestedInlineElements =
              codeElement.querySelectorAll("code.inline-code");
            if (nestedInlineElements.length > 0) {
              nestedInlineElements.forEach((nested) => {
                if (nested !== codeElement) {
                  // Replace with its content
                  nested.replaceWith(nested.textContent || "");
                }
              });
            }
          });

          // Ensure all chart containers maintain their layout
          const chartContainers =
            clonedContainer.querySelectorAll(".chart-container");
          chartContainers.forEach((container) => {
            (container as HTMLElement).style.width = "100%";
            (container as HTMLElement).style.boxSizing = "border-box";

            // Preserve layout class styles
            const layoutClass = Array.from(
              (container as HTMLElement).classList
            ).find((cls) => cls.startsWith("chart-layout-"));

            if (layoutClass) {
              // Enforce flex layout based on the layout type
              if (layoutClass === "chart-layout-full") {
                (container as HTMLElement).style.flexDirection = "column";
                (container as HTMLElement).style.alignItems = "center";
              } else if (layoutClass === "chart-layout-left") {
                (container as HTMLElement).style.flexDirection = "row";
              } else if (layoutClass === "chart-layout-right") {
                (container as HTMLElement).style.flexDirection = "row-reverse";
              } else if (layoutClass === "chart-layout-center") {
                (container as HTMLElement).style.flexDirection = "row";
              }
            }

            // Fix child elements sizing
            const chartVisuals = container.querySelectorAll(".chart-visual");
            const chartTexts = container.querySelectorAll(".chart-text");

            chartVisuals.forEach((visual) => {
              (visual as HTMLElement).style.display = "flex";
              (visual as HTMLElement).style.justifyContent = "center";
              (visual as HTMLElement).style.alignItems = "center";
            });
          });
        }

        // Fix the chart text paragraphs to properly display line breaks
        const chartTextBlocks = clonedContainer.querySelectorAll(".chart-text");
        chartTextBlocks.forEach((textBlock) => {
          const paragraphs = textBlock.querySelectorAll("p");
          paragraphs.forEach((paragraph) => {
            (paragraph as HTMLElement).style.whiteSpace = "pre-wrap";
            (paragraph as HTMLElement).style.wordWrap = "break-word";

            // Ensure <br> tags are properly displayed
            const brTags = paragraph.querySelectorAll("br");
            brTags.forEach((br) => {
              (br as HTMLElement).style.display = "block";
              (br as HTMLElement).style.marginTop = "8px";
            });
          });
        });
      },
    });

    // Initialize the PDF
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    // Add the canvas image to the PDF
    const imgData = canvas.toDataURL("image/png", 1.0); // Higher quality
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Check if content spans multiple pages
    let heightLeft = imgHeight;
    let position = 0;
    let pageOffset = 0;

    // Add first page
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add subsequent pages if needed
    while (heightLeft > 0) {
      pageOffset += pageHeight;
      position = -pageOffset;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save the PDF
    pdf.save(`${title}.pdf`);

    console.log("PDF export successful");
  } catch (error) {
    console.error("PDF export failed:", error);
    alert("PDF 내보내기에 실패했습니다. 콘솔을 확인하세요.");
    throw error;
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};

export { exportToPdf };
