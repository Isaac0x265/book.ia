import jsPDF from 'jspdf'
import { Chapter, Mode } from '../types'

export const downloadPDF = async (chapters: Chapter[], topic: string, mode: Mode) => {
  const pdf = new jsPDF()
  const pageHeight = pdf.internal.pageSize.height
  const pageWidth = pdf.internal.pageSize.width
  let yPosition = 30

  // Cover page for ebook mode
  if (mode === 'ebook') {
    const maxWidth = 170 // Maximum width for text content
    let currentY = 60
    
    // Title with automatic sizing and wrapping
    pdf.setFont('helvetica', 'bold')
    const title = topic.toUpperCase()
    
    // Start with large font and reduce if text is too wide
    let titleFontSize = 24
    pdf.setFontSize(titleFontSize)
    
    while (pdf.getTextWidth(title) > maxWidth && titleFontSize > 12) {
      titleFontSize -= 2
      pdf.setFontSize(titleFontSize)
    }
    
    // If still too wide, split into multiple lines
    const titleLines = pdf.splitTextToSize(title, maxWidth)
    
    // Center each line
    titleLines.forEach((line: string, index: number) => {
      const lineWidth = pdf.getTextWidth(line)
      const xPosition = (pageWidth - lineWidth) / 2
      pdf.text(line, xPosition, currentY + (index * (titleFontSize * 0.6)))
    })
    
    currentY += titleLines.length * (titleFontSize * 0.6) + 20
    
    // Subtitle
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'normal')
    const subtitle = 'AI-Generated Comprehensive Guide'
    const subtitleLines = pdf.splitTextToSize(subtitle, maxWidth)
    
    subtitleLines.forEach((line: string, index: number) => {
      const lineWidth = pdf.getTextWidth(line)
      const xPosition = (pageWidth - lineWidth) / 2
      pdf.text(line, xPosition, currentY + (index * 16))
    })
    
    currentY += subtitleLines.length * 16 + 15
    
    // Date
    pdf.setFontSize(12)
    const date = new Date().toLocaleDateString()
    const dateWidth = pdf.getTextWidth(date)
    pdf.text(date, (pageWidth - dateWidth) / 2, currentY)
    
    pdf.addPage()
    yPosition = 30
  }

  chapters.forEach((chapter, index) => {
    if (index > 0 || mode === 'ebook') {
      if (yPosition > 50) {
        pdf.addPage()
        yPosition = 30
      }
    }

    // Chapter title with better formatting
    pdf.setFontSize(mode === 'ebook' ? 18 : 16)
    pdf.setFont('helvetica', 'bold')
    const cleanTitle = chapter.title.replace(/[^\w\s:\-\(\)]/g, '') // Remove emojis for PDF
    const titleLines = pdf.splitTextToSize(cleanTitle, 170)
    
    titleLines.forEach((line: string) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage()
        yPosition = 30
      }
      pdf.text(line, 20, yPosition)
      yPosition += 12
    })
    
    yPosition += 8 // Extra spacing after title

    // Process content with better formatting
    const contentText = chapter.content
      .replace(/[#*_`]/g, '') // Remove markdown symbols
      .replace(/[^\w\s\.\,\!\?\:\;\(\)\-\n]/g, '') // Remove emojis and special chars
      .replace(/\n+/g, '\n\n') // Normalize line breaks
      .split('\n\n')

    contentText.forEach((paragraph: string) => {
      if (paragraph.trim()) {
        // Check if it's a header (starts with uppercase and is short)
        const isHeader = paragraph.length < 80 && paragraph.match(/^[A-Z][^.]*$/)
        
        if (isHeader) {
          pdf.setFontSize(14)
          pdf.setFont('helvetica', 'bold')
          yPosition += 8
        } else {
          pdf.setFontSize(11)
          pdf.setFont('helvetica', 'normal')
        }

        const paragraphLines = pdf.splitTextToSize(paragraph.trim(), 170)
        
        paragraphLines.forEach((line: string) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage()
            yPosition = 30
          }
          pdf.text(line, 20, yPosition)
          yPosition += isHeader ? 8 : 6
        })
        
        yPosition += isHeader ? 4 : 8 // Extra spacing after headers/paragraphs
      }
    })
    
    yPosition += 15 // Space between chapters
  })

  // Footer on each page for ebook mode
  if (mode === 'ebook') {
    const totalPages = pdf.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setFont('helvetica', 'normal')
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 40, pageHeight - 10)
      if (i > 1) { // Skip footer on cover page
        pdf.text(topic, 20, pageHeight - 10)
      }
    }
  }

  const fileName = `${topic.replace(/\s+/g, '_')}_${mode}_${new Date().getTime()}.pdf`
  pdf.save(fileName)
}