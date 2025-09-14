import { useState, useEffect } from 'react';
import { Camera, Sparkles, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useClothDetect, DetectResult } from '@/hooks/useClothDetect';
import { CameraCapture } from '@/components/CameraCapture';
import { cn } from '@/lib/utils';
import { Item } from '@/types';

const itemTypes = ['top', 'bottom', 'shoes', 'outer', 'accessory'];
const seasons = ['spring', 'summer', 'fall', 'winter', 'all'];
const occasions = ['casual', 'smart', 'formal', 'active'];
const availableColors = ['white', 'black', 'navy', 'beige', 'brown', 'grey', 'blue', 'dark-blue'];

interface AddItemFormProps {
  item?: Item | null;
  onSave: (item: Omit<Item, 'id' | 'userId'>) => void;
  onCancel: () => void;
}

export function AddItemForm({ item, onSave, onCancel }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'top' as Item['type'],
    colors: [] as string[],
    seasons: [] as string[],
    occasions: [] as string[],
    brand: '',
    imageUrl: '/mock/white-tee.jpg',
    tags: [] as string[]
  });

  const [showCamera, setShowCamera] = useState(false);
  const [aiDetectedFields, setAiDetectedFields] = useState<Set<string>>(new Set());
  const [newTag, setNewTag] = useState('');
  const { detectCloth, isDetecting } = useClothDetect();
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        type: item.type,
        colors: item.colors,
        seasons: item.seasons,
        occasions: item.occasions,
        brand: item.brand || '',
        imageUrl: item.imageUrl,
        tags: item.tags || []
      });
      setAiDetectedFields(new Set());
    } else {
      setFormData({
        name: '',
        type: 'top',
        colors: [],
        seasons: [],
        occasions: [],
        brand: '',
        imageUrl: '/mock/white-tee.jpg',
        tags: []
      });
      setAiDetectedFields(new Set());
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter an item name",
        variant: "destructive"
      });
      return;
    }
    onSave(formData);
  };

  const toggleArrayValue = (array: string[], value: string) => {
    return array.includes(value)
      ? array.filter(v => v !== value)
      : [...array, value];
  };

  const handleCameraCapture = async (imageData: string) => {
    setFormData(prev => ({ ...prev, imageUrl: imageData }));
    setShowCamera(false);
    
    // Auto-detect after capturing image
    await handleAiDetect(imageData);
  };

  const handleAiDetect = async (imageUrl?: string) => {
    try {
      // Create a mock file for the API call
      const mockFile = new File([''], 'image.jpg', { type: 'image/jpeg' });
      
      const result = await detectCloth(mockFile);
      const detectedFields = new Set<string>();

      // Apply AI results to form
      setFormData(prev => {
        const updated = { ...prev };
        
        if (result.name) {
          updated.name = result.name;
          detectedFields.add('name');
        }
        if (result.type) {
          updated.type = result.type;
          detectedFields.add('type');
        }
        if (result.brand) {
          updated.brand = result.brand;
          detectedFields.add('brand');
        }
        if (result.colors?.length) {
          updated.colors = result.colors;
          detectedFields.add('colors');
        }
        if (result.seasons?.length) {
          updated.seasons = result.seasons;
          detectedFields.add('seasons');
        }
        if (result.occasions?.length) {
          updated.occasions = result.occasions;
          detectedFields.add('occasions');
        }
        if (result.tags?.length) {
          updated.tags = result.tags;
          detectedFields.add('tags');
        }

        return updated;
      });

      setAiDetectedFields(detectedFields);
      
      toast({
        title: "AI Detection Complete",
        description: "Form has been auto-filled with detected information"
      });
    } catch (error) {
      toast({
        title: "Detection Failed",
        description: "Could not analyze the image. Please fill manually.",
        variant: "destructive"
      });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handleCameraCapture}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Section */}
      <Card className="p-4">
        <Label className="text-sm font-medium">Item Photo</Label>
        <div className="space-y-3 mt-2">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCamera(true)}
              className="flex-1"
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Photo
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAiDetect()}
              disabled={isDetecting}
              className="px-6"
            >
              {isDetecting ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              {isDetecting ? 'Detecting...' : 'AI Detect'}
            </Button>
          </div>
          
          <Input
            placeholder="Or paste image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
          />
          
          {formData.imageUrl && !formData.imageUrl.startsWith('data:') && (
            <div className="text-center">
              <img
                src={formData.imageUrl}
                alt="Item preview"
                className="w-32 h-32 object-cover mx-auto rounded-lg border-2 border-border"
                onError={() => setFormData(prev => ({ ...prev, imageUrl: '/mock/white-tee.jpg' }))}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., White Cotton T-Shirt"
            className={cn(
              aiDetectedFields.has('name') && "border-emerald-500 bg-emerald-50/50"
            )}
          />
        </div>

        <div>
          <Label htmlFor="type">Type</Label>
          <Select 
            value={formData.type} 
            onValueChange={(value: Item['type']) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger className={cn(
              aiDetectedFields.has('type') && "border-emerald-500 bg-emerald-50/50"
            )}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {itemTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
            placeholder="e.g., Uniqlo"
            className={cn(
              aiDetectedFields.has('brand') && "border-emerald-500 bg-emerald-50/50"
            )}
          />
        </div>
      </div>

      {/* Colors */}
      <div>
        <Label className="text-sm font-medium">Colors</Label>
        <div className={cn(
          "grid grid-cols-4 gap-2 mt-2 p-3 rounded-lg border",
          aiDetectedFields.has('colors') && "border-emerald-500 bg-emerald-50/50"
        )}>
          {availableColors.map(color => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                checked={formData.colors.includes(color)}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    colors: checked 
                      ? [...prev.colors, color]
                      : prev.colors.filter(c => c !== color)
                  }));
                }}
              />
              <span className="text-xs capitalize">{color}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seasons */}
      <div>
        <Label className="text-sm font-medium">Seasons</Label>
        <div className={cn(
          "grid grid-cols-3 gap-2 mt-2 p-3 rounded-lg border",
          aiDetectedFields.has('seasons') && "border-emerald-500 bg-emerald-50/50"
        )}>
          {seasons.map(season => (
            <div key={season} className="flex items-center space-x-2">
              <Checkbox
                checked={formData.seasons.includes(season)}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    seasons: checked 
                      ? [...prev.seasons, season]
                      : prev.seasons.filter(s => s !== season)
                  }));
                }}
              />
              <span className="text-xs capitalize">{season}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Occasions */}
      <div>
        <Label className="text-sm font-medium">Occasions</Label>
        <div className={cn(
          "grid grid-cols-2 gap-2 mt-2 p-3 rounded-lg border",
          aiDetectedFields.has('occasions') && "border-emerald-500 bg-emerald-50/50"
        )}>
          {occasions.map(occasion => (
            <div key={occasion} className="flex items-center space-x-2">
              <Checkbox
                checked={formData.occasions.includes(occasion)}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    occasions: checked 
                      ? [...prev.occasions, occasion]
                      : prev.occasions.filter(o => o !== occasion)
                  }));
                }}
              />
              <span className="text-xs capitalize">{occasion}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label className="text-sm font-medium">Tags</Label>
        <div className={cn(
          "space-y-3 mt-2 p-3 rounded-lg border",
          aiDetectedFields.has('tags') && "border-emerald-500 bg-emerald-50/50"
        )}>
          <div className="flex gap-2">
            <Input
              placeholder="Add tag (e.g., cotton, basic)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              className="flex-1"
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-primary-glow">
          {item ? 'Update' : 'Add'} Item
        </Button>
      </div>
    </form>
  );
}