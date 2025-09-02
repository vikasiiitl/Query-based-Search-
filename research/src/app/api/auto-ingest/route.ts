import * as cheerio from 'cheerio';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const { query, limit = 20, existingUrls = [] } = await request.json();
    
    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    console.log(`Searching arXiv for: "${query}" with limit: ${limit}`);
    console.log(`Skipping ${existingUrls.length} existing papers from user collection`);

    // Use arXiv API to get papers
    const arxivQuery = encodeURIComponent(query);
    const fetchLimit = limit * 3; // Fetch more papers to account for duplicates
    const arxivUrl = `http://export.arxiv.org/api/query?search_query=all:${arxivQuery}&start=0&max_results=${fetchLimit}&sortBy=submittedDate&sortOrder=descending`;

    const response = await fetch(arxivUrl, {
      headers: {
        'User-Agent': 'Research-App/1.0',
        'Accept': 'application/atom+xml'
      }
    });

    if (!response.ok) {
      throw new Error(`arXiv API error: ${response.status}`);
    }

    const xmlText = await response.text();
    const allPapers = parseArxivXML(xmlText);
    
    console.log(`Found ${allPapers.length} papers from arXiv`);
    
    if (allPapers.length === 0) {
      return Response.json({
        success: true,
        message: "No papers found for this query on arXiv",
        papers: []
      });
    }

    // Filter out papers from user's collection
    const newPapers = allPapers.filter(paper => !existingUrls.includes(paper.htmlUrl));
    console.log(`Found ${newPapers.length} papers not in user collection (filtered out ${allPapers.length - newPapers.length})`);

    // Get base URL for internal API calls
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000';

    const successfulPapers = [];
    let processed = 0;
    let failed = 0;
    let alreadyInVespa = 0;

    // Process papers
    for (const paper of newPapers) {
      try {
        console.log(`Processing: ${paper.title}`);
        console.log(`HTML URL: ${paper.htmlUrl}`);

        // Use this corrected Vespa check instead
console.log(`Checking if paper is already in Vespa...`);
try {
  const vespaCheckResponse = await fetch(`${baseUrl}/api/vespa/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      checkUrl: paper.htmlUrl  // Use the new checkUrl parameter
    })
  });

  if (vespaCheckResponse.ok) {
    const vespaResult = await vespaCheckResponse.json();
    
    if (vespaResult.exists) {
      console.log(`⚠️ Paper already in Vespa, skipping: ${paper.title}`);
      alreadyInVespa++;
      continue;
    } else {
      console.log(`✅ Paper not found in Vespa, proceeding with extraction`);
    }
  }
} catch (error) {
  console.log(`Failed to check Vespa (will try to index anyway): ${error.message}`);
}

        // Step 1: Check if HTML is available
        const headResponse = await fetch(paper.htmlUrl, { 
          method: 'HEAD',
          headers: { 'User-Agent': 'Research-App/1.0' }
        });
        
        if (!headResponse.ok) {
          console.log(`❌ HTML not available for: ${paper.title}`);
          failed++;
          continue;
        }

        // Step 2: Use your extract API
        console.log(`Extracting content using your API...`);
        const extractResponse = await fetch(`${baseUrl}/api/extract?url=${encodeURIComponent(paper.htmlUrl)}`);

        if (!extractResponse.ok) {
          console.log(`❌ Extract failed for: ${paper.title}`);
          failed++;
          continue;
        }

        const extractedData = await extractResponse.json();

        // Step 3: Validate that we have all required fields
        if (!extractedData.abstract || !extractedData.introduction || !extractedData.conclusion) {
          console.log(`❌ Missing required content sections for: ${paper.title}`);
          failed++;
          continue;
        }

        // Step 4: Use your Vespa load API
        console.log(`Loading to Vespa using your API...`);
        const loadResponse = await fetch(`${baseUrl}/api/vespa/load`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document: {
              url: paper.htmlUrl,
              title: paper.title,
              abstract: extractedData.abstract,
              introduction: extractedData.introduction,
              conclusion: extractedData.conclusion
            }
          })
        });

        if (!loadResponse.ok) {
          console.log(`❌ Vespa load failed for: ${paper.title}`);
          failed++;
          continue;
        }

        // Success - add to result list
        processed++;
        successfulPapers.push({
          url: paper.htmlUrl,
          title: paper.title,
          abstract: extractedData.abstract,
          introduction: extractedData.introduction,
          conclusion: extractedData.conclusion,
          indexed: true
        });
        
        console.log(`✅ Successfully processed: ${paper.title} (${processed}/${limit})`);

        // Stop after processing enough papers
        if (processed >= limit) {
          console.log(`Reached target of ${limit} papers - stopping`);
          break;
        }

        // Small delay between papers
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        failed++;
        console.error(`❌ Failed to process ${paper.title}:`, error);
      }
    }

    return Response.json({
      success: true,
      message: `Auto-ingestion completed: ${processed} new papers ingested`,
      papers: successfulPapers,
      stats: {
        total_found: allPapers.length,
        new_papers: newPapers.length,
        already_in_vespa: alreadyInVespa,
        processed: processed,
        failed: failed
      }
    });

  } catch (error) {
    console.error('Auto-ingest error:', error);
    return Response.json(
      { error: `Auto-ingestion failed: ${error.message}` },
      { status: 500 }
    );
  }
}




// Helper function to parse arXiv XML response
function parseArxivXML(xmlText) {
  const papers = [];
  
  const entryMatches = xmlText.match(/<entry>(.*?)<\/entry>/gs);
  
  if (!entryMatches) {
    return papers;
  }

  for (const entry of entryMatches) {
    try {
      const idMatch = entry.match(/<id>(.*?)<\/id>/);
      const fullId = idMatch ? idMatch[1].split('/').pop() : '';
      
      if (!fullId) continue;
      
      const titleMatch = entry.match(/<title>(.*?)<\/title>/s);
      const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : 'Unknown Title';
      
      const summaryMatch = entry.match(/<summary>(.*?)<\/summary>/s);
      const summary = summaryMatch ? summaryMatch[1].trim().replace(/\s+/g, ' ') : '';
      
      const htmlUrl = `https://arxiv.org/html/${fullId}`;
      
      if (title && fullId) {
        papers.push({
          id: fullId,
          title: title,
          summary: summary,
          htmlUrl: htmlUrl
        });
      }
    } catch (parseError) {
      console.error('Error parsing entry:', parseError);
    }
  }
  
  return papers;
}