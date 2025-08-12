import jsPDF from 'jspdf'
import { Chapter, Mode } from '../types'

export const downloadPDF = async (chapters: Chapter[], topic: string, mode: Mode) => {
  const pdf = new jsPDF()
  const pageHeight = pdf.internal.pageSize.height
  let yPosition = 30

  // Simple cover page for ebook mode
  if (mode === 'ebook') {
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(20)
    pdf.text(topic.toUpperCase(), 20, 60)
    
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'normal')
    pdf.text('AI-Generated Guide', 20, 80)
    
    pdf.setFontSize(12)
    pdf.text(new Date().toLocaleDateString(), 20, 100)
    
    pdf.addPage()
    yPosition = 30
  }

  chapters.forEach((chapter, index) => {
    if (index > 0 || mode === 'ebook') {
      pdf.addPage()
      yPosition = 30
    }

    // Chapter title
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    // Remove emojis and special characters for PDF
    const cleanTitle = chapter.title.replace(/[^\w\s:\-\(\)]/g, '')
    pdf.text(cleanTitle, 20, yPosition)
    yPosition += 20

    // Chapter content - simple text processing
    const contentText = chapter.content
      .replace(/[#*_`]/g, '') // Remove markdown symbols
      .replace(/[^\w\s\.\,\!\?\:\;\(\)\-\n]/g, '') // Remove emojis
      .split('\n')
      .filter(line => line.trim())

    pdf.setFontSize(11)
    pdf.setFont('helvetica', 'normal')

    contentText.forEach((line: string) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = 30
      }
      
      const textLines = pdf.splitTextToSize(line.trim(), 170)
      textLines.forEach((textLine: string) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage()
          yPosition = 30
        }
        pdf.text(textLine, 20, yPosition)
        yPosition += 6
      })
      yPosition += 4
    })
  })

  const fileName = `${topic.replace(/\s+/g, '_')}_${mode}.pdf`
  pdf.save(fileName)
}