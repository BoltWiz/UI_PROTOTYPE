import { useState, useRef, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Image, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ComposerProps {
  onSendMessage: (content: string, type: 'text' | 'image') => void;
  disabled?: boolean;
  placeholder?: string;
}

export function Composer({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Type a message..." 
}: ComposerProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim(), 'text');
      setMessage('');
      setIsTyping(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (value: string) => {
    setMessage(value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    // Typing indicator
    if (value && !isTyping) {
      setIsTyping(true);
    } else if (!value && isTyping) {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock image upload - in real app, upload to server first
      const imageUrl = URL.createObjectURL(file);
      onSendMessage(imageUrl, 'image');
    }
  };

  return (
    <div className="p-4 border-t border-border bg-background">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "min-h-[40px] max-h-32 resize-none pr-20",
              "focus-visible:ring-1"
            )}
            rows={1}
          />
          
          {/* Action buttons inside textarea */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          size="sm"
          className="h-10 w-10 rounded-full p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Typing indicator */}
      {isTyping && (
        <div className="mt-2 text-xs text-muted-foreground">
          Typing...
        </div>
      )}
    </div>
  );
}