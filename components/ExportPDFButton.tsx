"use client";

import { useRef } from "react";
import { Download } from "lucide-react";

interface ExportPDFButtonProps {
  targetId: string;
  filename?: string;
  title?: string;
}

export default function ExportPDFButton({ targetId, filename = "planner-hub-plan", title }: ExportPDFButtonProps) {
  const loadingRef = useRef(false);

  const handleExport = async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    const btn = document.getElementById("export-pdf-btn");
    if (btn) {
      btn.textContent = "Generating PDF…";
      (btn as HTMLButtonElement).disabled = true;
    }

    try {
      const [jsPDF, html2canvas] = await Promise.all([
        import("jspdf").then((m) => m.jsPDF),
        import("html2canvas").then((m) => m.default),
      ]);

      const element = document.getElementById(targetId);
      if (!element) throw new Error("Target element not found");

      // Scroll to top for clean capture
      window.scrollTo(0, 0);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#070b14",
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 12;
      const contentWidth = pageWidth - margin * 2;

      // Header
      pdf.setFillColor(7, 11, 20);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");

      // Gradient header bar
      pdf.setFillColor(0, 212, 255);
      pdf.rect(0, 0, pageWidth, 18, "F");
      pdf.setFillColor(124, 58, 237);
      pdf.rect(pageWidth * 0.5, 0, pageWidth * 0.5, 18, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(255, 255, 255);
      pdf.text("⚡ PLANNER HUB", margin, 12);

      if (title) {
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.text(title, pageWidth - margin, 12, { align: "right" });
      }

      pdf.setFontSize(7);
      pdf.text(
        `Generated ${new Date().toLocaleDateString("en-US", { dateStyle: "long" })}`,
        pageWidth - margin,
        16,
        { align: "right" }
      );

      // Content image
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = contentWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      const startY = 22;
      const availHeight = pageHeight - startY - 10;

      if (imgHeight <= availHeight) {
        pdf.addImage(imgData, "PNG", margin, startY, imgWidth, imgHeight);
      } else {
        // Multi-page
        let yOffset = 0;
        let isFirst = true;
        while (yOffset < imgHeight) {
          if (!isFirst) {
            pdf.addPage();
            // Re-add dark background
            pdf.setFillColor(7, 11, 20);
            pdf.rect(0, 0, pageWidth, pageHeight, "F");
          }
          const currentY = isFirst ? startY : 10;
          const sliceHeight = isFirst ? availHeight : pageHeight - 20;
          pdf.addImage(
            imgData,
            "PNG",
            margin,
            currentY - (yOffset * imgWidth) / imgProps.width,
            imgWidth,
            imgHeight
          );
          yOffset += (sliceHeight * imgProps.width) / imgWidth;
          isFirst = false;
        }
      }

      // Footer
      const totalPages = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(7);
        pdf.setTextColor(100, 120, 160);
        pdf.text(
          `Page ${i} of ${totalPages} · PlannerHub.ai · AI-Powered Planning`,
          pageWidth / 2,
          pageHeight - 5,
          { align: "center" }
        );
      }

      pdf.save(`${filename}-${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
      alert("PDF export failed. Please try again.");
    } finally {
      loadingRef.current = false;
      const btn = document.getElementById("export-pdf-btn");
      if (btn) {
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Export PDF';
        (btn as HTMLButtonElement).disabled = false;
      }
    }
  };

  return (
    <button
      id="export-pdf-btn"
      onClick={handleExport}
      className="btn btn-secondary"
      style={{ gap: "0.5rem", display: "inline-flex", alignItems: "center" }}
    >
      <Download size={16} />
      Export PDF
    </button>
  );
}
