import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, X, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const collectionSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  cover: z.string().min(1, 'Vui lòng chọn ảnh bìa'),
  tags: z.array(z.string()).min(1, 'Phải có ít nhất 1 tag'),
  seasons: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 mùa'),
  occasions: z.array(z.string()).min(1, 'Phải chọn ít nhất 1 dịp'),
  status: z.enum(['draft', 'published'])
});

type CollectionForm = z.infer<typeof collectionSchema>;

// Mock existing collection data
const mockCollections = {
  'c1': {
    id: 'c1',
    stylistId: 's1',
    title: 'Corporate Chic',
    description: 'Professional outfits that command respect while maintaining elegance. Perfect for office environments and business meetings.',
    cover: '/mock/outfit1.jpg',
    tags: ['professional', 'elegant', 'timeless'],
    seasons: ['autumn', 'winter'],
    occasions: ['work', 'formal'],
    status: 'published' as const,
    items: [
      { type: 'top', imageUrl: '/mock/navy-polo.jpg', colors: ['navy'], notes: 'Classic navy polo' },
      { type: 'bottom', imageUrl: '/mock/dark-jeans.jpg', colors: ['dark-blue'], notes: 'Dark wash jeans' },
      { type: 'shoes', imageUrl: '/mock/brown-loafers.jpg', colors: ['brown'], notes: 'Brown leather loafers' }
    ],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  }
};

const mockImages = [
  '/mock/outfit1.jpg',
  '/mock/outfit2.jpg', 
  '/mock/beige-coat.jpg',
  '/mock/navy-polo.jpg',
  '/mock/white-tee.jpg',
  '/mock/dark-jeans.jpg',
  '/mock/navy-chino.jpg',
  '/mock/brown-loafers.jpg',
  '/mock/white-sneaker.jpg',
  '/mock/black-belt.jpg'
];

const availableSeasons = ['spring', 'summer', 'autumn', 'winter', 'all-season'];
const availableOccasions = ['work', 'casual', 'formal', 'sport', 'date', 'party'];
const itemTypes = [
  { value: 'top', label: 'Áo' },
  { value: 'bottom', label: 'Quần' },
  { value: 'shoes', label: 'Giày' },
  { value: 'outer', label: 'Áo khoác' },
  { value: 'accessory', label: 'Phụ kiện' }
];

export default function CollectionsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newTag, setNewTag] = useState('');
  const [items, setItems] = useState<Array<{
    type: string;
    imageUrl: string;
    colors: string[];
    notes?: string;
  }>>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const existingCollection = mockCollections[id as keyof typeof mockCollections];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CollectionForm>({
    resolver: zodResolver(collectionSchema),
    defaultValues: existingCollection ? {
      title: existingCollection.title,
      description: existingCollection.description,
      cover: existingCollection.cover,
      tags: existingCollection.tags,
      seasons: existingCollection.seasons,
      occasions: existingCollection.occasions,
      status: existingCollection.status
    } : {
      tags: [],
      seasons: [],
      occasions: [],
      status: 'draft'
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    if (existingCollection) {
      setItems(existingCollection.items);
    }
  }, [existingCollection]);

  const addTag = () => {
    if (newTag.trim() && !watchedValues.tags.includes(newTag.trim())) {
      setValue('tags', [...watchedValues.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValue('tags', watchedValues.tags.filter(tag => tag !== tagToRemove));
  };

  const toggleSeason = (season: string) => {
    const seasons = watchedValues.seasons.includes(season)
      ? watchedValues.seasons.filter(s => s !== season)
      : [...watchedValues.seasons, season];
    setValue('seasons', seasons);
  };

  const toggleOccasion = (occasion: string) => {
    const occasions = watchedValues.occasions.includes(occasion)
      ? watchedValues.occasions.filter(o => o !== occasion)
      : [...watchedValues.occasions, occasion];
    setValue('occasions', occasions);
  };

  const addItem = () => {
    setItems([...items, {
      type: 'top',
      imageUrl: mockImages[0],
      colors: ['navy']
    }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const onSubmit = (data: CollectionForm) => {
    // Mock collection update
    const updatedCollection = {
      ...existingCollection,
      ...data,
      items,
      updatedAt: new Date().toISOString()
    };

    console.log('Updated collection:', updatedCollection);
    
    toast({
      title: "Bộ sưu tập đã được cập nhật",
      description: `"${data.title}" đã được ${data.status === 'published' ? 'xuất bản' : 'lưu nháp'}.`
    });

    navigate('/stylist/collections');
  };

  const handleDelete = () => {
    // Mock collection deletion
    console.log('Deleting collection:', id);
    
    toast({
      title: "Bộ sưu tập đã được xóa",
      description: "Bộ sưu tập đã được xóa khỏi hệ thống.",
      variant: "destructive"
    });

    navigate('/stylist/collections');
  };

  if (!existingCollection) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy bộ sưu tập</h2>
          <Button onClick={() => navigate('/stylist/collections')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/stylist/collections')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Chỉnh sửa bộ sưu tập</h1>
            <p className="text-muted-foreground">Cập nhật thông tin bộ sưu tập</p>
          </div>
        </div>
        
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Bạn có chắc chắn muốn xóa bộ sưu tập "{existingCollection.title}"?</p>
              <p className="text-sm text-muted-foreground">Hành động này không thể hoàn tác.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Hủy
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Xóa bộ sưu tập
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Nhập tiêu đề bộ sưu tập..."
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Mô tả chi tiết về bộ sưu tập..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <Label>Ảnh bìa</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {mockImages.map((image) => (
                      <div
                        key={image}
                        className={`aspect-square bg-muted rounded cursor-pointer border-2 transition-colors ${
                          watchedValues.cover === image ? 'border-primary' : 'border-transparent'
                        }`}
                        onClick={() => setValue('cover', image)}
                      >
                        <img src={image} alt="Cover option" className="w-full h-full object-cover rounded" />
                      </div>
                    ))}
                  </div>
                  {errors.cover && (
                    <p className="text-sm text-red-600 mt-1">{errors.cover.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Items - Similar to New collection but with existing items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Items trong bộ sưu tập
                  <Button type="button" onClick={addItem} size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-20 bg-muted rounded overflow-hidden">
                          <img src={item.imageUrl} alt="Item" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <div>
                            <Label>Loại</Label>
                            <Select 
                              value={item.type} 
                              onValueChange={(value) => updateItem(index, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {itemTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Ảnh</Label>
                            <Select 
                              value={item.imageUrl} 
                              onValueChange={(value) => updateItem(index, 'imageUrl', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {mockImages.map((image) => (
                                  <SelectItem key={image} value={image}>
                                    {image.split('/').pop()}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="col-span-2">
                            <Label>Ghi chú (tùy chọn)</Label>
                            <Input
                              value={item.notes || ''}
                              onChange={(e) => updateItem(index, 'notes', e.target.value)}
                              placeholder="Ghi chú về item này..."
                            />
                          </div>
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeItem(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {items.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Upload className="w-8 h-8 mx-auto mb-2" />
                      <p>Chưa có item nào. Thêm item để bắt đầu.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Same as New but with existing data */}
          <div className="space-y-6">
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Thêm tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {watchedValues.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                
                {errors.tags && (
                  <p className="text-sm text-red-600">{errors.tags.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Seasons & Occasions - Same as New */}
            <Card>
              <CardHeader>
                <CardTitle>Mùa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availableSeasons.map((season) => (
                    <div key={season} className="flex items-center space-x-2">
                      <Checkbox
                        id={`season-${season}`}
                        checked={watchedValues.seasons.includes(season)}
                        onCheckedChange={() => toggleSeason(season)}
                      />
                      <Label htmlFor={`season-${season}`} className="capitalize">
                        {season.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.seasons && (
                  <p className="text-sm text-red-600 mt-2">{errors.seasons.message}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dịp</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {availableOccasions.map((occasion) => (
                    <div key={occasion} className="flex items-center space-x-2">
                      <Checkbox
                        id={`occasion-${occasion}`}
                        checked={watchedValues.occasions.includes(occasion)}
                        onCheckedChange={() => toggleOccasion(occasion)}
                      />
                      <Label htmlFor={`occasion-${occasion}`} className="capitalize">
                        {occasion}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.occasions && (
                  <p className="text-sm text-red-600 mt-2">{errors.occasions.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Update Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Cập nhật</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="draft"
                      checked={watchedValues.status === 'draft'}
                      onCheckedChange={() => setValue('status', 'draft')}
                    />
                    <Label htmlFor="draft">Lưu nháp</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="published"
                      checked={watchedValues.status === 'published'}
                      onCheckedChange={() => setValue('status', 'published')}
                    />
                    <Label htmlFor="published">Xuất bản</Label>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button type="submit" className="w-full">
                    Cập nhật bộ sưu tập
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/stylist/collections')}>
                    Hủy
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
