import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Descendant, Text, Element as SlateElement } from "slate";

const slateToHtml = (nodes: Descendant[]): string => {
  let html = "";

  const processNode = (node: any): string => {
    // Text node - explicitly check if it's a text node by looking for 'text' property
    if (Text.isText(node)) {
      let text = node.text;

      // Apply text formatting
      if (node.bold) text = `<strong>${text}</strong>`;
      if (node.italic) text = `<em>${text}</em>`;
      if (node.underline) text = `<u>${text}</u>`;
      if (node.strikethrough) text = `<s>${text}</s>`;
      if (node.code) text = `<code>${text}</code>`;

      return text;
    }

    // Element nodes - make sure it has children before processing
    if (!node.children) {
      console.warn("Node without children found:", node);
      return "";
    }

    const children = node.children.map(processNode).join("");

    switch (node.type) {
      case "paragraph":
        const align = node.align ? ` style="text-align: ${node.align}"` : "";
        return `<p${align}>${children}</p>`;

      case "heading-one":
        return `<h1>${children}</h1>`;

      case "heading-two":
        return `<h2>${children}</h2>`;

      case "block-quote":
        return `<blockquote>${children}</blockquote>`;

      case "numbered-list":
        return `<ol>${children}</ol>`;

      case "bulleted-list":
        return `<ul>${children}</ul>`;

      case "list-item":
        return `<li>${children}</li>`;

      case "image":
        return `<div><img src="${node.url}" alt="Image" style="max-width: 100%;" /></div>`;

      case "table":
        return `<table border="1" style="border-collapse: collapse; width: 100%;">${children}</table>`;

      case "table-row":
        return `<tr>${children}</tr>`;

      case "table-cell":
        return `<td style="padding: 8px;">${children}</td>`;

      case "link":
        return `<a href="${node.url}" target="_blank">${children}</a>`;

      case "chart-block":
        // Add a class to help with styling
        return `<div class="chart-container" style="border: 1px solid #ccc; padding: 10px; margin: 15px 0; text-align: center;">
          <p><strong>Chart:</strong> This chart will be rendered as an image in the PDF</p>
          ${children}
        </div>`;

      case "chart":
        // For chart elements, return a placeholder
        return `<div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px;">
          <p style="text-align: center; color: #666;">Chart visualization</p>
        </div>`;

      default:
        // For unknown types, return the children wrapped in a div
        console.warn(`Unknown node type: ${node.type}`, node);
        return `<div>${children}</div>`;
    }
  };

  // Process each top-level node
  for (const node of nodes) {
    try {
      html += processNode(node);
    } catch (error) {
      console.error("Error processing node:", node, error);
      html += '<div style="color: red;">Error rendering content</div>';
    }
  }

  return html;
};

// Function to export content as PDF
const exportToPdf = async (title: string, content: Descendant[]) => {
  // Create a temporary container for the content
  const container = document.createElement("div");
  container.style.padding = "20px";
  container.style.width = "210mm"; // A4 width
  container.style.margin = "0 auto";
  container.style.fontSize = "12pt";
  container.style.fontFamily = "Arial, sans-serif";

  // Add title
  const titleElement = document.createElement("h1");
  titleElement.textContent = title;
  titleElement.style.marginBottom = "20px";
  titleElement.style.textAlign = "center";
  container.appendChild(titleElement);

  // Add styling for PDF
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    img { max-width: 100%; height: auto; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    td, th { border: 1px solid #ddd; padding: 8px; }
    blockquote { border-left: 3px solid #ccc; margin-left: 0; padding-left: 10px; color: #666; }
    h1, h2, h3 { margin-top: 20px; }
    .chart-container { page-break-inside: avoid; }
  `;
  container.appendChild(styleElement);

  // Convert Slate content to HTML and add to container
  try {
    const contentHtml = slateToHtml(content);
    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = contentHtml;
    container.appendChild(contentDiv);
  } catch (error) {
    console.error("Error converting content to HTML:", error);
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML =
      '<p style="color: red;">Error converting document content</p>';
    container.appendChild(errorDiv);
  }

  // Add to document temporarily
  document.body.appendChild(container);

  try {
    // Convert the HTML to a canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
    });

    // Initialize the PDF
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    // Add the canvas image to the PDF
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Check if content spans multiple pages
    const pageHeight = 297; // A4 height in mm
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add subsequent pages if needed
    while (heightLeft > 0) {
      position = -pageHeight * (imgHeight / heightLeft);
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
