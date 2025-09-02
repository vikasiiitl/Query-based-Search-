'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import axios from 'axios';
import { indexDocumentInVespa } from '@/lib/vespa/indexing';

type ArxivData = {
  url: string;
  title: string;
  abstract: string;
  introduction: string;
  conclusion: string;
  indexed: boolean;
};

const fetchArxivData = async (url: string): Promise<ArxivData> => {
  const response = await axios.get(`/api/extract?url=${encodeURIComponent(url)}`);
  return { ...response.data, url, indexed: false };
};

export default function ResearchPage() {
  const [inputUrl, setInputUrl] = useState('');
  const [urlList, setUrlList] = useState<string[]>([]);
  const [papers, setPapers] = useState<ArxivData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [indexingStatus, setIndexingStatus] = useState('');
  const [indexProgress, setIndexProgress] = useState(0);
  const [isIndexing, setIsIndexing] = useState(false);
  
  // Auto-ingest states
  const [autoIngestQuery, setAutoIngestQuery] = useState('');
  const [autoIngestLoading, setAutoIngestLoading] = useState(false);
  
  // Similar papers states
  const [similarPaperUrl, setSimilarPaperUrl] = useState('');
  const [similarPaperLoading, setSimilarPaperLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('arxivPapers');
    if (saved) {
      setPapers(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('arxivPapers', JSON.stringify(papers));
  }, [papers]);

  const handleAddUrl = () => {
    if (inputUrl && !urlList.includes(inputUrl)) {
      setUrlList([...urlList, inputUrl]);
      setInputUrl('');
    }
  };

  const handleFetchAll = async () => {
    if (urlList.length === 0) return;

    setLoading(true);
    const fetchedData: ArxivData[] = [];

    for (const url of urlList) {
      try {
        const data = await fetchArxivData(url);
        fetchedData.push(data);
      } catch (error) {
        console.error(`Failed to fetch ${url}`, error);
      }
    }

    setPapers(prev => [...prev, ...fetchedData]);
    setUrlList([]);
    setLoading(false);
  };

  // Auto-ingest function
  const handleAutoIngest = async () => {
    if (!autoIngestQuery.trim()) return;

    setAutoIngestLoading(true);
    try {
      // const existingUrls = papers.map(paper => paper.url);
      const response = await axios.post('/api/auto-ingest', {
        query: autoIngestQuery,
        limit: 20,
        // existingUrls
      });

      if (response.data.success) {
        const ingestedPapers = response.data.papers || [];
        setPapers(prev => [...prev, ...ingestedPapers]);
        setAutoIngestQuery('');
        alert(`Successfully ingested ${ingestedPapers.length} papers matching "${autoIngestQuery}"`);
      } else {
        alert(`Auto-ingest error: ${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Auto-ingest failed:', error);
      alert('Failed to auto-ingest papers. Please try again.');
    }
    setAutoIngestLoading(false);
  };

  // Similar papers function
  const handleFindSimilar = async () => {
    if (!similarPaperUrl.trim()) return;
    
    setSimilarPaperLoading(true);
    try {
      const response = await axios.post('/api/auto-ingest-similar', {
        htmlUrl: similarPaperUrl,
        limit: 20
      });

      if (response.data.success) {
        const similarPapers = response.data.papers || [];
        setPapers(prev => [...prev, ...similarPapers]);
        setSimilarPaperUrl('');
        
        if (similarPapers.length > 0) {
          alert(`Found and ingested ${similarPapers.length} similar papers!`);
        } else {
          alert('No similar papers found or all similar papers failed extraction.');
        }
      } else {
        alert(`Similar papers error: ${response.data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Similar papers search failed:', error);
      alert('Failed to find similar papers. Please try again.');
    }
    setSimilarPaperLoading(false);
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  const startIndexing = async () => {
    const papersToIndex = papers.filter(p => !p.indexed);
    if (papersToIndex.length === 0) return;

    setIsIndexing(true);
    const totalItems = papersToIndex.length;
    let processedItems = 0;

    for (const paper of papersToIndex) {
      setIndexingStatus(`Indexing: ${paper.title}`);

      try {
        await indexDocumentInVespa({
          title: paper.title,
          abstract: paper.abstract,
          introduction: paper.introduction,
          conclusion: paper.conclusion,
          url: paper.url
        });

        setPapers(prev =>
          prev.map(p =>
            p.url === paper.url ? { ...p, indexed: true } : p
          )
        );
      } catch (error) {
        console.error(`Failed to index: ${paper.title}`, error);
      }

      processedItems++;
      setIndexProgress(Math.round((processedItems / totalItems) * 100));
    }

    setIndexingStatus('Indexing complete.');
    setIsIndexing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">🧠 ArXiv Research Extractor</h1>
          <nav className="space-x-4">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black">Home</Link>
            <Link href="/chat">
              <Button variant="outline" size="sm">Go to Chat</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Auto-Ingest Section */}
        <Card className="border-green-200">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <label htmlFor="auto-ingest" className="block text-sm font-medium text-green-700">
                🤖 Auto-Ingest Papers by Query
              </label>
              <div className="flex gap-2">
                <Input
                  id="auto-ingest"
                  placeholder="e.g., computer vision, machine learning, transformer"
                  value={autoIngestQuery}
                  onChange={(e) => setAutoIngestQuery(e.target.value)}
                />
                <Button 
                  onClick={handleAutoIngest} 
                  disabled={autoIngestLoading} 
                  className="bg-green-600 hover:bg-green-700"
                >
                  {autoIngestLoading ? 'Auto-Ingesting...' : 'Auto-Ingest'}
                </Button>
              </div>
              <p className="text-xs text-green-600">
                Automatically finds, extracts, and indexes ArXiv papers matching your query
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Similar Papers Section */}
        <Card className="border-blue-200">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <label htmlFor="similar-ingest" className="block text-sm font-medium text-blue-700">
                🔗 Find Similar Papers
              </label>
              <div className="flex gap-2">
                <Input
                  id="similar-ingest"
                  placeholder="https://arxiv.org/html/2508.13154v1"
                  value={similarPaperUrl}
                  onChange={(e) => setSimilarPaperUrl(e.target.value)}
                />
                <Button 
                  onClick={handleFindSimilar} 
                  disabled={similarPaperLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {similarPaperLoading ? 'Finding Similar...' : 'Find Similar'}
                </Button>
              </div>
              <p className="text-xs text-blue-600">
                Analyzes the paper content and finds similar papers on ArXiv
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Manual URL Input Section */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-1">
              <label htmlFor="arxiv-url" className="block text-sm font-medium text-gray-700">
                Add ArXiv Paper URL
              </label>
              <div className="flex gap-2">
                <Input
                  id="arxiv-url"
                  placeholder="https://arxiv.org/html/2502.09457v1"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                />
                <Button onClick={handleAddUrl}>Add</Button>
              </div>
            </div>

            {urlList.length > 0 && (
              <div className="text-sm text-muted-foreground mt-2">
                <strong>Pending URLs:</strong>
                <ul className="list-disc ml-6 mt-1">
                  {urlList.map((url, i) => <li key={i}>{url}</li>)}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={handleFetchAll} disabled={loading || urlList.length === 0}>
                {loading ? 'Fetching...' : 'Fetch All Papers'}
              </Button>
              <Button onClick={startIndexing} disabled={isIndexing || papers.every(p => p.indexed)} variant="secondary">
                {isIndexing ? 'Indexing...' : 'Start Indexing'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Indexing Progress Bar */}
        {isIndexing && (
          <Card className="border-blue-600">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{indexingStatus}</p>
                  <p className="text-sm text-gray-500">{indexProgress}%</p>
                </div>
                <Progress value={indexProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Display Fetched Papers */}
        {papers.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-green-700">📄 Fetched Papers ({papers.length}):</h3>
            {papers.map((paper, idx) => (
              <Card key={idx}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="font-medium">{paper.title}</div>
                      <Badge
                        variant="outline"
                        className={
                          paper.indexed
                            ? "text-green-700 border-green-700"
                            : "text-red-700 border-red-700"
                        }
                      >
                        {paper.indexed ? 'Indexed' : 'Not Indexed'}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpand(idx)}
                    >
                      {expandedIndex === idx ? 'Hide Details' : 'View Details'}
                    </Button>
                  </div>
                  <div className="text-sm text-muted-foreground">{paper.url}</div>

                  {expandedIndex === idx && (
                    <div className="pt-2 space-y-2 text-sm">
                      <p><strong>Abstract:</strong> {paper.abstract}</p>
                      <p><strong>Introduction:</strong> {paper.introduction}</p>
                      <p><strong>Conclusion:</strong> {paper.conclusion}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}