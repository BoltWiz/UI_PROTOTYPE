import { useState } from 'react';
import { OutfitConstraints } from '@/types/outfit';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Settings2, X } from 'lucide-react';

interface RefineConstraintsProps {
  constraints: OutfitConstraints;
  onUpdate: (constraints: OutfitConstraints) => void;
  onRegenerate: () => void;
}

const COLORS = [
  { value: '#000000', name: 'Black' },
  { value: '#FFFFFF', name: 'White' },
  { value: '#DC143C', name: 'Red' },
  { value: '#228B22', name: 'Green' },
  { value: '#1B365D', name: 'Navy' },
  { value: '#8B4513', name: 'Brown' },
  { value: '#808080', name: 'Grey' },
  { value: '#FFD700', name: 'Gold' },
];

export function RefineConstraints({ 
  constraints, 
  onUpdate, 
  onRegenerate 
}: RefineConstraintsProps) {
  const [open, setOpen] = useState(false);
  const [localConstraints, setLocalConstraints] = useState<OutfitConstraints>(constraints);

  const handleApply = () => {
    onUpdate(localConstraints);
    onRegenerate();
    setOpen(false);
  };

  const handleReset = () => {
    const resetConstraints = {};
    setLocalConstraints(resetConstraints);
    onUpdate(resetConstraints);
    onRegenerate();
    setOpen(false);
  };

  const toggleAvoidColor = (color: string) => {
    const current = localConstraints.avoidColors || [];
    const updated = current.includes(color)
      ? current.filter(c => c !== color)
      : [...current, color];
    
    setLocalConstraints({
      ...localConstraints,
      avoidColors: updated.length > 0 ? updated : undefined
    });
  };

  const activeFiltersCount = Object.values(constraints).filter(Boolean).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings2 className="w-4 h-4" />
          Refine
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 px-1 py-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Refine Outfit Suggestions</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Style Preference */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Required Style</Label>
            <Select 
              value={localConstraints.requireStyle || 'none'} 
              onValueChange={(value) => setLocalConstraints({
                ...localConstraints,
                requireStyle: value === 'none' ? undefined : value as any
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Any style</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="smart">Smart Casual</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
                <SelectItem value="sport">Sporty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Weather */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Weather Condition</Label>
            <Select 
              value={localConstraints.weather || 'none'} 
              onValueChange={(value) => setLocalConstraints({
                ...localConstraints,
                weather: value === 'none' ? undefined : value as any
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any weather" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Any weather</SelectItem>
                <SelectItem value="sunny">Sunny</SelectItem>
                <SelectItem value="rainy">Rainy</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="hot">Hot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Avoid Colors */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Avoid Colors</Label>
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map(color => (
                <button
                  key={color.value}
                  type="button"
                  className={cn(
                    "relative p-2 rounded-md border-2 transition-all hover:scale-105",
                    localConstraints.avoidColors?.includes(color.value)
                      ? "border-destructive ring-2 ring-destructive/20"
                      : "border-border hover:border-muted-foreground"
                  )}
                  onClick={() => toggleAvoidColor(color.value)}
                >
                  <div
                    className="w-full h-6 rounded-sm"
                    style={{ backgroundColor: color.value }}
                  />
                  <p className="text-xs mt-1 truncate">{color.name}</p>
                  
                  {localConstraints.avoidColors?.includes(color.value) && (
                    <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Reset All
            </Button>
            <Button onClick={handleApply} className="flex-1">
              Apply & Regenerate
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}