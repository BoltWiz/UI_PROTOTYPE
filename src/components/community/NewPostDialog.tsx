import { useState } from 'react';
import { Camera, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NewPostDialogProps {
  onCreatePost: (data: { caption: string; tags: string[]; image: string }) => void;
  challengeInfo?: {
    title: string;
    hashtag: string;
  };
}

export function NewPostDialog({ onCreatePost, challengeInfo }: NewPostDialogProps) {
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [selectedOutfit, setSelectedOutfit] = useState('/mock/outfit1.jpg');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onCreatePost({
      caption: caption.trim(),
      tags: tagArray,
      image: selectedOutfit
    });

    setCaption('');
    setTags('');
  };

  const mockOutfits = [
    '/mock/outfit1.jpg',
    '/mock/outfit2.jpg',
    '/mock/white-tee.jpg',
    '/mock/navy-chino.jpg'
  ];

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          Share Your Style
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Outfit Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            Choose your outfit photo
          </label>
          <div className="grid grid-cols-2 gap-3">
            {mockOutfits.map((outfit, index) => (
              <button
                key={outfit}
                type="button"
                onClick={() => setSelectedOutfit(outfit)}
                className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                  selectedOutfit === outfit
                    ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]'
                    : 'border-border hover:border-primary/50 hover:shadow-md'
                }`}
              >
                <img 
                  src={outfit} 
                  alt={`Outfit ${index + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                />
                {selectedOutfit === outfit && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            Tell us about your outfit
          </label>
          <Textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What inspired this look? Where are you wearing it?"
            className="min-h-[100px] resize-none border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        {/* Tags */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Tag className="w-4 h-4 text-primary" />
            Add tags
          </label>
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="casual, work, summer, date-night..."
            className="border-0 bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary"
          />
          <p className="text-xs text-muted-foreground">
            Separate tags with commas to help others discover your style
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1 bg-gradient-to-r from-primary to-accent" 
            disabled={!caption.trim()}
          >
            Share Your Style
          </Button>
        </div>
      </form>
    </div>
  );
}