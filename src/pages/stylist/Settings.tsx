import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Camera, 
  Instagram, 
  Globe, 
  Briefcase,
  MessageCircle,
  Save,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const specialtyOptions = [
  'Minimalist', 'Corporate', 'Casual', 'Formal', 'Street Style',
  'Vintage', 'Bohemian', 'Avant-garde', 'Sustainable Fashion',
  'Color Analysis', 'Body Type Styling', 'Personal Shopping'
];

export default function StylistSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState({
    bio: user?.bio || '',
    specialties: user?.specialties || ['Corporate', 'Minimalist'],
    socialLinks: user?.socialLinks || {
      instagram: '',
      website: '',
      portfolio: ''
    },
    acceptsRequests: true,
    profileImage: ''
  });

  const [newSpecialty, setNewSpecialty] = useState('');

  const handleSave = () => {
    // Mock save functionality
    toast({
      title: "Profile updated",
      description: "Your stylist profile has been saved successfully.",
    });
  };

  const addSpecialty = (specialty: string) => {
    if (specialty && !profile.specialties.includes(specialty)) {
      setProfile(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your stylist profile and preferences</p>
      </div>

      {/* Profile Picture & Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.profileImage} />
                <AvatarFallback className="text-lg">
                  {user?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                variant="secondary" 
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-2">
                Verified Stylist
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell clients about your experience, style philosophy, and approach to styling..."
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              {profile.bio.length}/500 characters
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Specialties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Style Specialties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {profile.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                {specialty}
                <button
                  onClick={() => removeSpecialty(specialty)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a specialty..."
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSpecialty(newSpecialty)}
            />
            <Button onClick={() => addSpecialty(newSpecialty)} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {specialtyOptions
              .filter(option => !profile.specialties.includes(option))
              .map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  size="sm"
                  onClick={() => addSpecialty(option)}
                >
                  {option}
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </Label>
            <Input
              id="instagram"
              placeholder="@username or full URL"
              value={profile.socialLinks.instagram}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, instagram: e.target.value }
              }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website
            </Label>
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              value={profile.socialLinks.website}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, website: e.target.value }
              }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="portfolio" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Portfolio
            </Label>
            <Input
              id="portfolio"
              placeholder="Link to your portfolio"
              value={profile.socialLinks.portfolio}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, portfolio: e.target.value }
              }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Consultation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Consultation Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Accept New Requests</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to send you consultation requests
              </p>
            </div>
            <Switch
              checked={profile.acceptsRequests}
              onCheckedChange={(checked) => 
                setProfile(prev => ({ ...prev, acceptsRequests: checked }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}