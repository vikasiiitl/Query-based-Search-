import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL parameter' }, { status: 400 });
  }

  console.log(`Extracting content from: ${url}`);

  try {
    const res = await axios.get(url, {
      timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Research-Bot/1.0)' }
    });
    
    const $ = cheerio.load(res.data);
    const title = $('title').text().replace('arXiv.org', '').trim();
    
    // IMPROVED ABSTRACT EXTRACTION - try multiple selectors
    let abstract = '';
    const abstractSelectors = [
      '.ltx_abstract p',                  // Standard abstract
      '.abstract p',                      // Alternative class
      'div[class*="abstract"] p',         // Any div with abstract in class
      'div.abstract',                     // Abstract div
      'section:contains("Abstract")',     // Section containing "Abstract"
      'div:contains("Abstract") + p',     // Paragraph after Abstract heading
      '#abstract',                        // Abstract with ID
    ];
    
    for (const selector of abstractSelectors) {
      const text = $(selector).text().trim();
      if (text && text.length > 50) {
        abstract = text;
        break;
      }
    }
    
    // If still no abstract, look for a paragraph after "Abstract" heading
    if (!abstract) {
      $('h1, h2, h3, h4, h5').each((i, el) => {
        if ($(el).text().trim().toLowerCase() === 'abstract') {
          let nextP = $(el).next('p');
          if (nextP.length && nextP.text().trim().length > 50) {
            abstract = nextP.text().trim();
            return false; // break each loop
          }
        }
      });
    }
    
    // IMPROVED INTRODUCTION EXTRACTION - try multiple selectors and patterns
    let introduction = '';
    
    // Try common section IDs
    const introSelectors = [
      '#S1 p',                           // Standard S1
      '#sec1 p',                         // Alternative sec1
      '#section1 p',                     // Full section1
      '#introduction p',                 // By name
      'section:contains("Introduction") p', // Section with title
      'div:contains("Introduction") p',    // Div with title
    ];
    
    for (const selector of introSelectors) {
      const paragraphs = $(selector).map((_, el) => $(el).text().trim()).get().join('\n\n');
      if (paragraphs && paragraphs.length > 100) {
        introduction = paragraphs;
        break;
      }
    }
    
    // If still no introduction, look for heading-based approach
    if (!introduction) {
      $('h1, h2, h3, h4, h5').each((i, el) => {
        if ($(el).text().trim().toLowerCase().includes('introduction')) {
          // Get all paragraphs until the next heading
          let introText = '';
          let next = $(el).next();
          
          while (next.length && !next.is('h1, h2, h3, h4, h5')) {
            if (next.is('p')) {
              introText += next.text().trim() + '\n\n';
            }
            next = next.next();
          }
          
          if (introText.length > 100) {
            introduction = introText.trim();
            return false; // break each loop
          }
        }
      });
    }
    
    // IMPROVED CONCLUSION EXTRACTION - try multiple patterns
    let conclusion = '';
    
    // Try common section IDs for conclusion (can be in different sections)
    const possibleConclusionIDs = Array.from({length: 10}, (_, i) => i + 1)
      .map(num => `#S${num} h2, #S${num} h3, #sec${num} h2, #sec${num} h3, #section${num} h2, #section${num} h3`);
    
    // Look for conclusion headings
    for (const selector of possibleConclusionIDs) {
      $(selector).each((_, heading) => {
        const headingText = $(heading).text().trim().toLowerCase();
        if (headingText.includes('conclusion') || 
            headingText.includes('discussion') || 
            headingText.includes('summary') || 
            headingText.includes('final remarks')) {
          
          // Get section containing the heading
          const section = $(heading).closest('section, div');
          const paragraphs = section.find('p').map((_, el) => $(el).text().trim()).get().join('\n\n');
          
          if (paragraphs && paragraphs.length > 100) {
            conclusion = paragraphs;
            return false; // break each loop
          }
        }
      });
      
      if (conclusion) break;
    }
    
    // Direct selectors for conclusion
    if (!conclusion) {
      const conclusionSelectors = [
        '#conclusion p',
        '#conclusions p',
        '#discussion p',
        'section:contains("Conclusion") p',
        'div:contains("Conclusion") p',
        'section:contains("Discussion") p',
      ];
      
      for (const selector of conclusionSelectors) {
        const paragraphs = $(selector).map((_, el) => $(el).text().trim()).get().join('\n\n');
        if (paragraphs && paragraphs.length > 100) {
          conclusion = paragraphs;
          break;
        }
      }
    }
    
    // Heading-based approach for conclusion
    if (!conclusion) {
      $('h1, h2, h3, h4, h5').each((i, el) => {
        const headingText = $(el).text().trim().toLowerCase();
        if (headingText.includes('conclusion') || 
            headingText.includes('discussion') || 
            headingText.includes('summary')) {
          
          // Get all paragraphs until the next heading
          let concText = '';
          let next = $(el).next();
          
          while (next.length && !next.is('h1, h2, h3, h4, h5')) {
            if (next.is('p')) {
              concText += next.text().trim() + '\n\n';
            }
            next = next.next();
          }
          
          if (concText.length > 100) {
            conclusion = concText.trim();
            return false; // break each loop
          }
        }
      });
    }
    
    // If still missing sections, try last resort
    if (!abstract || !introduction || !conclusion) {
      console.log(`Missing sections for ${url}: Abstract: ${!!abstract}, Intro: ${!!introduction}, Conclusion: ${!!conclusion}`);
      
      // Last resort: For intro, get first substantial paragraphs after abstract
      if (!introduction) {
        const allParagraphs = $('p').map((_, el) => $(el).text().trim()).get();
        const potentialIntro = allParagraphs
          .filter(p => p.length > 100)
          .slice(0, 3)
          .join('\n\n');
          
        if (potentialIntro.length > 200) {
          introduction = potentialIntro;
        }
      }
      
      // Last resort: For conclusion, get last substantial paragraphs
      if (!conclusion) {
        const allParagraphs = $('p').map((_, el) => $(el).text().trim()).get();
        const potentialConclusion = allParagraphs
          .filter(p => p.length > 100)
          .slice(-3)
          .join('\n\n');
          
        if (potentialConclusion.length > 200) {
          conclusion = potentialConclusion;
        }
      }
    }
    
    // Add fallbacks if sections are still missing
    abstract = abstract || "No abstract could be extracted from this paper.";
    introduction = introduction || "No introduction could be extracted from this paper.";
    conclusion = conclusion || "No conclusion could be extracted from this paper.";
    
    console.log(`✅ Extraction completed for: ${title}`);
    console.log(`Abstract: ${abstract.substring(0, 100)}...`);
    console.log(`Introduction: ${introduction.substring(0, 100)}...`);
    console.log(`Conclusion: ${conclusion.substring(0, 100)}...`);

    return NextResponse.json({
      url,
      title,
      abstract,
      introduction,
      conclusion
    });
  } catch (err) {
    console.error(`❌ Extraction failed for ${url}:`, err);
    return NextResponse.json({ error: 'Failed to extract paper data' }, { status: 500 });
  }
}