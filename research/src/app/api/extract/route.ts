import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
  }

  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    const title = $('title').text().replace('arXiv.org', '').trim();

    const abstract = $('.ltx_abstract p').text().trim() || 'N/A';
    const introduction = $('#S1 p').map((_, el) => $(el).text().trim()).get().join('\n\n') || 'N/A';
    const conclusion = $('#S6 p').map((_, el) => $(el).text().trim()).get().join('\n\n') || 'N/A';

    return NextResponse.json({
      url,
      title,
      abstract,
      introduction,
      conclusion
    });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to extract paper data' }, { status: 500 });
  }
}
