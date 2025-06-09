import { Injectable } from '@angular/core';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generatePdf(content: string, fileName: string) {
    const pdf = new jspdf.jsPDF();

    // Generar el PDF a partir del contenido HTML
    pdf.html(content, {
      callback: (doc) => {
        doc.save(`${fileName}.pdf`);
      },
      x: 10,
      y: 10
    });
  }
}
