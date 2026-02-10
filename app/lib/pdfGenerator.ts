import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateATSReportPDF = (data: any) => {
    const doc = new jsPDF();

    // Colors
    const primaryColor = "#a855f7"; // Neon Purple equivalent
    const secondaryColor = "#3b82f6"; // Neon Blue equivalent
    const darkColor = "#030014"; // Dark BG equivalent (for text)

    // Header
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMIND AI - ATS ANALYSIS REPORT", 105, 13, { align: "center" });

    let yPos = 30;

    // Applicant Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Company: ${data.companyName || "N/A"}`, 14, yPos);
    doc.text(`Job Title: ${data.jobTitle || "N/A"}`, 14, yPos + 7);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 160, yPos);

    yPos += 20;

    // Overall Score
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.setFont("helvetica", "bold");
    doc.text(`Overall Match Score: ${data.feedback.overallScore}/100`, 14, yPos);

    yPos += 10;

    // Summary Table
    const summaryBody = [
        ["Tone & Style", `${data.feedback.toneAndStyle.score}/100`],
        ["Content", `${data.feedback.content.score}/100`],
        ["Skills", `${data.feedback.skills.score}/100`],
        ["Structure", `${data.feedback.structure.score}/100`],
    ];

    autoTable(doc, {
        startY: yPos,
        head: [["Category", "Score"]],
        body: summaryBody,
        theme: "striped",
        headStyles: { fillColor: secondaryColor },
        styles: { fontSize: 10 },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // ATS Tips
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text("ATS Compatibility Tips", 14, yPos);
    yPos += 8;

    const tipsBody = data.feedback.ATS.tips.map((tip: any) => [
        tip.type === "good" ? "GOOD" : "IMPROVE",
        tip.tip,
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [["Type", "Suggestion"]],
        body: tipsBody,
        theme: "grid",
        headStyles: { fillColor: secondaryColor },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 30 },
        },
        styles: { fontSize: 10 },
        didParseCell: function (data) {
            if (data.section === "body" && data.column.index === 0) {
                if (data.cell.raw === "GOOD") {
                    data.cell.styles.textColor = [0, 128, 0];
                } else {
                    data.cell.styles.textColor = [255, 165, 0]; // Orange/Yellow
                }
            }
        },
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Detailed Feedback (Content)
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text("Content Feedback", 14, yPos);
    yPos += 8;

    const contentTips = data.feedback.content.tips.map((tip: any) => [
        tip.type === "good" ? "GOOD" : "IMPROVE",
        tip.tip,
        tip.explanation
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [["Type", "Tip", "Explanation"]],
        body: contentTips,
        theme: 'grid',
        headStyles: { fillColor: secondaryColor },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 25 },
            1: { cellWidth: 60 }
        },
        styles: { fontSize: 9 }
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Page ${i} of ${pageCount}`,
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: "center" },
        );
    }

    doc.save("Resumind-AI-Report.pdf");
};
