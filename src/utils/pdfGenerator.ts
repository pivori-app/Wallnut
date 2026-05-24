import jsPDF from 'jspdf';
import { DocumentItem } from '../types';

export const generatePDF = async (document: DocumentItem): Promise<Blob> => {
  return new Promise((resolve) => {
    // Basic mock implementation of PDF generation
    const doc = new jsPDF();
    doc.text(`Document: ${document.name}`, 10, 10);
    // In a real scenario we'd embed the images (pages):
    // document.pages.forEach((page, i) => { ... doc.addImage(page.url, 'JPEG', ...) });

    const blob = doc.output('blob');
    resolve(blob);
  });
};

export const generateMergedPDF = async (documents: DocumentItem[], autoSort: boolean = true): Promise<Blob> => {
  return new Promise((resolve) => {
    const doc = new jsPDF();
    doc.text(`Documentation Complète`, 10, 10);
    
    let y = 20;
    documents.forEach((d, index) => {
      doc.text(`${index + 1}. ${d.name} - ${d.pages.length} pages`, 10, y);
      y += 10;
    });

    const blob = doc.output('blob');
    resolve(blob);
  });
};

export const downloadPDF = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
