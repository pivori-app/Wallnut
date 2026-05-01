import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToInstitutionalPDF(
  elementId: string, 
  data: { 
    bundleId: string; 
    propertyType: string; 
    city: string; 
    finalPrice: string;
    confidence: number;
  }
) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const ratio = imgProps.width / imgProps.height;
    const imgHeight = pdfWidth / ratio;

    // Header Institutional
    pdf.setFontSize(22);
    pdf.setTextColor(15, 23, 42); // slate-900
    pdf.text('Wallnut - Fiche d\'Estimation Institutionnelle', 40, 40);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139); // slate-500
    const now = new Date();
    pdf.text(`Généré le ${now.toLocaleDateString('fr-FR')} à ${now.toLocaleTimeString('fr-FR')}`, 40, 55);
    pdf.text(`ID Dossier: ${data.bundleId}`, 40, 65);
    pdf.text('DOCUMENT CONFIDENTIEL - USAGE EXCLUSIF', 40, 75);

    // Main Content Image
    pdf.addImage(imgData, 'PNG', 40, 100, pdfWidth - 80, (pdfWidth - 80) / ratio);

    // Footer & Disclaimer
    const footerY = pdfHeight - 60;
    pdf.line(40, footerY, pdfWidth - 40, footerY);
    
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184); // slate-400
    const disclaimer = "Estimation algorithmique générée selon les données DVF, Castorus et Yanport via le moteur Wallnut Engine V4.1.\nCe document est une simulation indicative et ne remplace pas une expertise physique réalisée par un professionnel qualifié.";
    pdf.text(disclaimer, 40, footerY + 15, { maxWidth: pdfWidth - 80 });

    pdf.setFontSize(10);
    pdf.setTextColor(15, 23, 42);
    pdf.text('wallnut.io - Solution de liquidité immobilière', pdfWidth / 2, pdfHeight - 20, { align: 'center' });

    pdf.save(`Wallnut_Estimation_${data.city}_${data.bundleId}.pdf`);
  } catch (error) {
    console.error('PDF Export failed:', error);
  }
}

export async function exportToDenonciationPDF(
  elementId: string,
  data: {
    ref: string;
    company: string;
    proId: string;
    city: string;
  }
) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const ratio = imgProps.width / imgProps.height;

    // Header Institutional
    pdf.setFontSize(22);
    pdf.setTextColor(15, 23, 42); // slate-900
    pdf.text('Wallnut - Fiche de Dénonciation', 40, 40);
    
    pdf.setFontSize(10);
    pdf.setTextColor(100, 116, 139); // slate-500
    const now = new Date();
    pdf.text(`Document émis le ${now.toLocaleDateString('fr-FR')}`, 40, 55);
    pdf.text(`ID Professionnel: ${data.proId}`, 40, 65);
    pdf.text(`Référence Dossier: ${data.ref}`, 40, 75);

    // Main Content Image
    pdf.addImage(imgData, 'PNG', 40, 100, pdfWidth - 80, (pdfWidth - 80) / ratio);

    // Legal Footer
    const footerY = pdfHeight - 60;
    pdf.setFontSize(8);
    pdf.setTextColor(15, 23, 42);
    pdf.text('Certifié conforme par Wallnut Protocol V4.1', pdfWidth / 2, footerY, { align: 'center' });
    pdf.text('La validité de ce document est de 30 jours calendaires.', pdfWidth / 2, footerY + 10, { align: 'center' });

    pdf.save(`Wallnut_Denonciation_${data.ref}.pdf`);
  } catch (error) {
    console.error('Denonciation PDF Export failed:', error);
  }
}
