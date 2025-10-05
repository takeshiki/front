import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Bot, ExternalLink, FileText, Download, LinkIcon } from "lucide-react"
import type { Message } from "@/lib/hooks/use-chat"

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-2`}>
        {/* Show content for user messages */}
        {isUser && (
          <Card className={`p-4 bg-primary text-primary-foreground`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </Card>
        )}

        {/* Show content for AI messages */}
        {!isUser && (
          <Card className={`p-4 bg-muted`}>
            <p className="whitespace-pre-wrap">{message.content}</p>
          </Card>
        )}

        {/* Show source files with download buttons */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="space-y-2 w-full">
            <p className="text-xs text-muted-foreground font-medium">Sources Used:</p>
            <div className="space-y-2">
              {(() => {
                // Deduplicate sources by resourceId or title+fileUrl/url combination
                const uniqueSources = message.sources.filter((source, index, self) =>
                  index === self.findIndex((s) =>
                    (s.resourceId && source.resourceId && s.resourceId === source.resourceId) ||
                    (!s.resourceId && !source.resourceId && s.title === source.title && s.fileUrl === source.fileUrl && s.url === source.url)
                  )
                );
                return uniqueSources.map((source, index) => (
                <div
                  key={index}
                  className="flex items-start justify-between gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {source.type === 'url' ? (
                      <LinkIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    ) : (
                      <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{source.title || source.fileName || "Document"}</h4>
                      {source.type === 'url' && source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:underline flex items-center gap-1 mt-1"
                        >
                          <span className="truncate">{source.url}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {source.type === 'url' && source.url && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={source.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Open
                        </a>
                      </Button>
                    )}
                    {source.type === 'file' && source.fileUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = `http://localhost:8000${source.fileUrl}`;
                          link.download = source.fileName || source.title;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
