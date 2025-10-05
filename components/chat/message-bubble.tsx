"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink, Download, File } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Source {
  type: "file" | "url"
  title: string
  url?: string
  excerpt?: string
  text?: string
  resourceId?: string
  fileName?: string
  fileUrl?: string
  resource?: {
    id: string
    type: string
    title: string
    fileName?: string
    fileUrl?: string
    url?: string
  }
}

interface Message {
  id: string
  conversationId: string
  role: "user" | "assistant"
  content: string
  sources?: Source[]
  createdAt: string
}

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { role, content, sources } = message
  const isUser = role === "user"

  const handleDownload = async (source: Source) => {
    const resource = source.resource || source
    const fileName = resource.fileName || resource.title || 'document'
    const resourceId = resource.id || source.resourceId
    
    if (!resourceId) {
      console.error('No resource ID available for:', resource)
      alert('Sorry, this file cannot be downloaded. Please contact support.')
      return
    }
    
    try {
      // Use the download endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
      const downloadUrl = `${apiUrl}/resources/${resourceId}/download`
      
      console.log('Downloading file:', { fileName, downloadUrl, resourceId })
      
      // Fetch the file
      const response = await fetch(downloadUrl)
      
      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`)
      }
      
      // Get the blob
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      alert(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? "ml-12" : "mr-12"}`}>
        <Card
          className={`p-4 ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          {isUser ? (
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Headings
                  h1: ({ node, ...props }) => (
                    <h1 className="text-xl font-bold mt-4 mb-2 text-foreground" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-lg font-bold mt-3 mb-2 text-foreground" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-base font-semibold mt-2 mb-1 text-foreground" {...props} />
                  ),
                  // Paragraphs
                  p: ({ node, ...props }) => (
                    <p className="mb-3 leading-relaxed text-foreground" {...props} />
                  ),
                  // Lists
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside mb-3 space-y-1 text-foreground" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside mb-3 space-y-1 text-foreground" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="ml-2 text-foreground" {...props} />
                  ),
                  // Code
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code className="bg-muted-foreground/20 px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props} />
                    ) : (
                      <code className="block bg-muted-foreground/20 p-3 rounded-lg my-2 text-sm font-mono overflow-x-auto text-foreground" {...props} />
                    ),
                  pre: ({ node, ...props }) => (
                    <pre className="bg-muted-foreground/20 p-3 rounded-lg my-2 overflow-x-auto" {...props} />
                  ),
                  // Links
                  a: ({ node, ...props }) => (
                    <a className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer" {...props} />
                  ),
                  // Blockquotes
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-3 text-muted-foreground" {...props} />
                  ),
                  // Tables
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-3">
                      <table className="min-w-full border-collapse border border-border text-foreground" {...props} />
                    </div>
                  ),
                  th: ({ node, ...props }) => (
                    <th className="border border-border px-3 py-2 bg-muted font-semibold text-left" {...props} />
                  ),
                  td: ({ node, ...props }) => (
                    <td className="border border-border px-3 py-2" {...props} />
                  ),
                  // Horizontal rule
                  hr: ({ node, ...props }) => (
                    <hr className="my-4 border-border" {...props} />
                  ),
                  // Strong/Bold
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold text-foreground" {...props} />
                  ),
                  // Emphasis/Italic
                  em: ({ node, ...props }) => (
                    <em className="italic text-foreground" {...props} />
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}

          {sources && sources.length > 0 && (
            <div className="mt-6 pt-4 border-t border-primary-foreground/10 space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                <p className="text-xs font-bold text-primary/90 uppercase tracking-wider px-2">
                  {sources.length} {sources.length === 1 ? 'Source' : 'Sources'}
                </p>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
              </div>
              
              {sources.map((source, index) => {
                const resource = source.resource || source
                const isFile = resource.type === 'file'
                const hasDownloadUrl = resource.fileUrl || resource.url
                const hasDownload = isFile && hasDownloadUrl
                
                return (
                  <Card
                    key={index}
                    className="p-4 bg-gradient-to-br from-background to-background/80 border-2 border-primary/30 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="shrink-0 mt-1">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          isFile 
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' 
                            : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                        }`}>
                          {isFile ? (
                            <FileText className="w-6 h-6" />
                          ) : (
                            <ExternalLink className="w-6 h-6" />
                          )}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-foreground mb-1 line-clamp-2">
                              {resource.title || resource.fileName || 'Document'}
                            </h4>
                            <Badge 
                              variant="secondary" 
                              className={`capitalize text-xs font-medium ${
                                isFile 
                                  ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30' 
                                  : 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                              }`}
                            >
                              <File className="w-3 h-3 mr-1" />
                              {resource.type === 'file' ? 'Document' : 'Web Link'}
                            </Badge>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex gap-2 shrink-0">
                            {!isFile && resource.url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-3 gap-2 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-400"
                                onClick={() => window.open(resource.url, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span className="hidden sm:inline">Open</span>
                              </Button>
                            )}
                            {hasDownload && (
                              <Button
                                variant="default"
                                size="sm"
                                className="h-9 px-3 gap-2 bg-primary hover:bg-primary/90"
                                onClick={() => handleDownload(source)}
                                title="Download file"
                              >
                                <Download className="w-4 h-4" />
                                <span className="hidden sm:inline">Download</span>
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {/* Excerpt */}
                        {(source.excerpt || source.text) && (
                          <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                            <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-4">
                              "{source.excerpt || (source.text && source.text.slice(0, 300) + (source.text.length > 300 ? '...' : ''))}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
