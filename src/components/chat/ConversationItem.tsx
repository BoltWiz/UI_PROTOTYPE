import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Conversation } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick: () => void;
}

export function ConversationItem({ conversation, isActive, onClick }: ConversationItemProps) {
  const otherParticipant = conversation.participants[0]; // Assuming current user is always index 1
  const hasUnread = (conversation.unreadCount ?? 0) > 0;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 cursor-pointer transition-colors border-b border-border/50",
        "hover:bg-muted/50",
        isActive && "bg-muted border-l-4 border-l-primary"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-12 w-12">
          <AvatarImage src={otherParticipant.avatarUrl} />
          <AvatarFallback>
            {otherParticipant.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        {otherParticipant.isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-medium text-sm truncate",
              hasUnread && "font-semibold"
            )}>
              {otherParticipant.name}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {otherParticipant.role}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {conversation.starred && (
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            )}
            {hasUnread && (
              <Badge variant="default" className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {conversation.unreadCount}
              </Badge>
            )}
          </div>
        </div>

        {conversation.lastMessage && (
          <p className={cn(
            "text-xs text-muted-foreground truncate mb-1",
            hasUnread && "text-foreground font-medium"
          )}>
            {conversation.lastMessage}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
          </span>
          {!otherParticipant.isOnline && otherParticipant.lastSeen && (
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(otherParticipant.lastSeen), { addSuffix: true })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}