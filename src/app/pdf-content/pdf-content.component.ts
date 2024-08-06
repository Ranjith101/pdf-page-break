import { Component, ElementRef, ViewChild } from '@angular/core';
import { PdfGenerationService } from '../pdf-generation.service';

@Component({
  selector: 'app-pdf-content',
  templateUrl: './pdf-content.component.html',
  styleUrls: ['./pdf-content.component.css']
})
export class PdfContentComponent {
  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  currentDate: string;

  constructor(private pdfService: PdfGenerationService) {
    this.currentDate = new Date().toLocaleDateString();
  }

  downloadPDF() {
    this.pdfService.generatePDF(this.pdfContent.nativeElement);
  }
}
