import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DateTime } from 'luxon';

export const exportToExcel = (data: any[], fileName: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const exportToPDF = (headers: string[], data: any[][], fileName: string, title: string) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(title, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    autoTable(doc, {
        head: [headers],
        body: data,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], textColor: 255 },
    });

    doc.save(`${fileName}.pdf`);
};
