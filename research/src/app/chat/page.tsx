"use client"

import { useState, useRef, useEffect, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, FileText, Calendar, Table, ExternalLink } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Source {
  id: string
  title: string
  type: "doc" | "sheet" | "calendar"
  snippet: string
  url: string
}

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  sources?: Source[]
}

export default function ChatPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getSourceIcon = (type: Source["type"]) => {
    switch (type) {
      case "doc":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "sheet":
        return <Table className="h-4 w-4 text-green-500" />
      case "calendar":
        return <Calendar className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: input,
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const res = await fetch("/api/vespa/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      })

      const data = await res.json()

      if (!res.ok || data.message === "No results found") {
        setMessages(prev => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            content: "Sorry, I couldn't find any relevant data for your query.",
            sources: [],
          },
        ])
      } else {
        const vespaHits = data.vespaHits || []

        const sources: Source[] = vespaHits.map((hit: any) => {
          return {
            id: hit.fields.document_id,
            title: hit.fields.title || "Untitled",
            type: "doc",
            snippet: hit.fields.introduction?.split("\n")[0] || "", // fallback snippet
            url: hit.fields.document_id,
          }
        })

        setMessages(prev => [
          ...prev,
          {
            id: `${Date.now()}-assistant`,
            role: "assistant",
            content: data.answer,
            sources,
          },
        ])
      }
    } catch (err) {
      console.error("Search error:", err)
      setMessages(prev => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: "Sorry, something went wrong while fetching the results.",
          sources: [],
        },
      ])
    }

    setInput("")
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)] flex flex-col">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chat with Your Data</h1>
      </header>

      <Card className="flex-1 mb-4 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                <p className="text-gray-500 max-w-md">
                  Ask questions about your uploaded or indexed content. For example, "Summarize the introduction" or "What’s the conclusion?"
                </p>
              </div>
            ) : (
              messages.map(message => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] whitespace-pre-wrap rounded-lg p-4 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <ReactMarkdown>{message.content}</ReactMarkdown>

                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 mb-2">Sources:</p>
                        <div className="space-y-2 max-h-[80px] overflow-y-auto pr-4">
                          {message.sources.map((source) => (
                            <div key={source.id} className="flex items-start gap-2 text-sm">
                              {getSourceIcon(source.type)}
                              <div className="flex-1">
                                <div className="font-medium">{source.title}</div>
                                <p className="text-xs text-gray-500 line-clamp-1">{source.snippet}</p>
                              </div>
                              <a target="_blank" rel="noopener noreferrer" href={source.url} className="text-blue-500 hover:text-blue-700">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your content..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  )
}
