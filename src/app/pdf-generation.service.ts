import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfGenerationService {

  constructor() { }

  public async generatePDF(content: HTMLElement) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const options = { scale: 2 };
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;
    let yOffset = margin;

    const addHtmlToPdf = async (element: HTMLElement) => {
      const canvas = await html2canvas(element, options);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Check if current content fits on the page
      if (yOffset + pdfHeight > pageHeight - margin) {
        doc.addPage();
        yOffset = margin;
      }

      doc.addImage(imgData, 'PNG', margin, yOffset, pdfWidth - 2 * margin, pdfHeight);
      yOffset += pdfHeight;
    };

    // Header
    const headerElement = content.querySelector('.pdf-header') as HTMLElement;
    if (headerElement) {
      await addHtmlToPdf(headerElement);
    }

    // Sections, Graphs, Tables
    const sections = ['.pdf-section', '.pdf-graph', '.pdf-table'];
    for (const selector of sections) {
      const elements = content.querySelectorAll(selector) as NodeListOf<HTMLElement>;
      for (const element of Array.from(elements)) {
        await addHtmlToPdf(element);
      }
    }

    // Footer
    const footerElement = content.querySelector('.pdf-footer') as HTMLElement;
    if (footerElement) {
      await addHtmlToPdf(footerElement);
    }

    doc.save('document.pdf');
  }


}
