import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const file = searchParams.get('file');

  if (!file) {
    return NextResponse.json({ error: 'File parameter required' }, { status: 400 });
  }

  try {
    // For the 1975 Census PDF, return actual page previews
    if (file.includes('1975')) {
      // Return actual PDF page URLs with page parameters
      const baseUrl = 'https://r.jina.ai/http://';
      const pdfUrl = `https://raw.githubusercontent.com/BAILANN-ctrl/LMIS/main/public/pdfs/1975%20Integrated%20Census%20of%20Population%20and%20Its%20Economic%20Activities%20-%20Camarines%20Sur.pdf`;
      
      return NextResponse.redirect(`${baseUrl}#page=${page}&url=${encodeURIComponent(pdfUrl)}`);
    }

    // For other PDFs, return placeholder response
    const pdfPages = {
      '1975 Integrated Census of Population and Its Economic Activities - Camarines Sur.pdf': {
        1: 'https://images.unsplash.com/photo-1507003211169-0121c2e0e44?w=400&h=600&fit=crop',
        2: 'https://images.unsplash.com/photo-1507003211169-0121c2e0e44?w=400&h=600&fit=crop',
        3: 'https://images.unsplash.com/photo-1507003211169-0121c2e0e44?w=400&h=600&fit=crop',
        4: 'https://images.unsplash.com/photo-1507003211169-0121c2e0e44?w=400&h=600&fit=crop',
        5: 'https://images.unsplash.com/photo-1507003211169-0121c2e0e44?w=400&h=600&fit=crop',
      }
    };

    const imageUrl = pdfPages[file]?.[page] || 'https://images.unsplash.com/photo-1507003211169-0121c2e0e44?w=400&h=600&fit=crop';

    return NextResponse.redirect(imageUrl);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process PDF' }, { status: 500 });
  }
}
