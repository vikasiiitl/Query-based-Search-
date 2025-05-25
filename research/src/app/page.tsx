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
        {/* Input Section */}
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
            <h3 className="text-lg font-semibold text-green-700">📄 Fetched Papers:</h3>
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
