import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  MoreHorizontal, 
  Phone, 
  Video, 
  Star, 
  Archive, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { Composer } from './Composer';
import { TypingIndicator } from './TypingIndicator';
import { useThread } from '@/hooks/useThread';
import { Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ThreadViewProps {
  conversation: Conversation;
  currentUserId: string;
  onBack?: () => void;
}

export function ThreadView({ conversation, currentUserId, onBack }: ThreadViewProps) {
  const { messages, loading, typing, sendMessage, markRead } = useThread(conversation.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId) 
    || conversation.participants[0];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read when thread opens
  useEffect(() => {
    markRead();
  }, [conversation.id, markRead]);

  const handleSendMessage = async (content: string, type: 'text' | 'image') => {
    await sendMessage({ content, type });
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-muted rounded animate-pulse mb-1" />
              <div className="h-3 bg-muted rounded animate-pulse w-24" />
            </div>
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 p-4 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn(
              "flex gap-3",
              i % 2 === 0 ? "justify-start" : "justify-end"
            )}>
              {i % 2 === 0 && (
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
              )}
              <div className={cn(
                "max-w-[70%] space-y-2",
                i % 2 === 0 ? "items-start" : "items-end"
              )}>
                <div className="h-16 bg-muted rounded-2xl animate-pulse w-full" />
              </div>
              {i % 2 === 1 && (
                <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Thread Header */}
      <div className="p-4 border-b border-border bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="md:hidden"
                onClick={onBack}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src={otherParticipant.avatarUrl} />
                <AvatarFallback>
                  {otherParticipant.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {otherParticipant.isOnline && (
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{otherParticipant.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {otherParticipant.role}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {otherParticipant.isOnline 
                  ? 'Online' 
                  : otherParticipant.lastSeen 
                    ? `Last seen ${new Date(otherParticipant.lastSeen).toLocaleString()}`
                    : 'Offline'
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Star className="h-4 w-4 mr-2" />
                  {conversation.starred ? 'Unstar' : 'Star'} Conversation
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-muted-foreground mb-2">
              No messages yet
            </div>
            <p className="text-sm text-muted-foreground">
              Start the conversation with {otherParticipant.name}
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwn = message.sender.id === currentUserId;
              const prevMessage = messages[index - 1];
              const showAvatar = !prevMessage || prevMessage.sender.id !== message.sender.id;
              
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  onRetry={() => {
                    // Handle retry for failed messages
                    console.log('Retry message:', message.id);
                  }}
                />
              );
            })}
            
            {/* Typing indicator */}
            {Object.keys(typing).some(userId => typing[userId] && userId !== currentUserId) && (
              <TypingIndicator 
                user={otherParticipant} 
              />
            )}
            
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Composer */}
      <Composer
        onSendMessage={handleSendMessage}
        placeholder={`Message ${otherParticipant.name}...`}
      />
    </div>
  );
}