import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, CheckCheck, Clock, RotateCcw, AlertCircle } from 'lucide-react';
import { Message } from '@/types/chat';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  onRetry?: () => void;
}

export function MessageBubble({ message, isOwn, showAvatar = true, onRetry }: MessageBubbleProps) {
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM d, HH:mm');
    }
  };

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className={cn(
      "flex gap-3 mb-4",
      isOwn ? "justify-end" : "justify-start"
    )}>
      {!isOwn && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.avatarUrl} />
          <AvatarFallback className="text-xs">
            {message.sender.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={cn(
        "flex flex-col max-w-[70%]",
        isOwn ? "items-end" : "items-start"
      )}>
        {!isOwn && showAvatar && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{message.sender.name}</span>
            <Badge variant="secondary" className="text-xs">
              {message.sender.role}
            </Badge>
          </div>
        )}

        <div className={cn(
          "rounded-2xl px-4 py-2 break-words",
          isOwn 
            ? "bg-primary text-primary-foreground rounded-br-md" 
            : "bg-muted text-foreground rounded-bl-md",
          message.status === 'failed' && "border border-destructive/50"
        )}>
          {message.type === 'text' ? (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          ) : (
            <img 
              src={message.content} 
              alt="Shared image" 
              className="max-w-full rounded-lg"
            />
          )}
        </div>

        <div className={cn(
          "flex items-center gap-2 mt-1 text-xs text-muted-foreground",
          isOwn ? "flex-row-reverse" : "flex-row"
        )}>
          <span>{formatMessageTime(message.createdAt)}</span>
          {isOwn && (
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              {message.status === 'failed' && onRetry && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-auto p-0 text-xs text-destructive hover:text-destructive"
                  onClick={onRetry}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {isOwn && showAvatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.avatarUrl} />
          <AvatarFallback className="text-xs">
            {message.sender.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}