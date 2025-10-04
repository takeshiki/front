import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Bot, ExternalLink, FileText } from "lucide-react"
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
        <Card className={`p-4 ${isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </Card>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium">Sources:</p>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((source, index) => (
                <Badge key={index} variant="outline" className="gap-1">
                  {source.type === "url" ? (
                    <>
                      <ExternalLink className="w-3 h-3" />
                      <a href={source.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {source.title || "Link"}
                      </a>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3 h-3" />
                      <span>{source.title || "Document"}</span>
                    </>
                  )}
                </Badge>
              ))}
            </div>
            {message.sources[0]?.excerpt && (
              <Card className="p-3 bg-muted/50 text-xs">
                <p className="text-muted-foreground italic">"{message.sources[0].excerpt}"</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
