import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserMini } from '@/types/chat';

interface TypingIndicatorProps {
  user: UserMini;
}

export function TypingIndicator({ user }: TypingIndicatorProps) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback className="text-xs">
          {user.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}