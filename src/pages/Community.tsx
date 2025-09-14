import { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Post } from '@/types';
import { getCommunityPosts, saveCommunityPosts, addPost, reportPost, getCurrentUser } from '@/lib/mock';

import { StatsBar } from '@/components/community/StatsBar';
import { HashtagCloud } from '@/components/community/HashtagCloud';
import { CommunityTabs } from '@/components/community/CommunityTabs';
import { SearchFilters } from '@/components/community/SearchFilters';
import { EnhancedPostCard } from '@/components/community/EnhancedPostCard';
import { Sidebar } from '@/components/community/Sidebar';
import { NewPostDialog } from '@/components/community/NewPostDialog';
import { PostSkeleton } from '@/components/community/PostSkeleton';
import { WeeklyChallengeWidget } from '@/components/challenges/WeeklyChallengeWidget';

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('latest');
  const [selectedTag, setSelectedTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [activeChallenge, setActiveChallenge] = useState(null);
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadPosts();
    loadActiveChallenge();
  }, [activeTab, selectedTag, searchQuery, timeFilter]);

  const loadActiveChallenge = async () => {
    try {
      const response = await fetch('/src/data/challenges.json');
      const challenges = await response.json();
      const active = challenges.find((c: any) => c.status === 'active');
      setActiveChallenge(active || null);
    } catch (error) {
      console.error('Failed to load active challenge:', error);
    }
  };

  const loadPosts = async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const communityPosts = getCommunityPosts().filter(post => post.status === 'visible');
    
    // Add extensive mock posts
    const mockPosts = [
      {
        id: 'mock-1',
        userId: 'user-2',
        image: '/mock/outfit1.jpg',
        caption: 'Perfect casual look for weekend brunch! Love how these jeans pair with the cozy sweater 🤎 The texture contrast really makes this outfit special.',
        tags: ['casual', 'weekend', 'cozy', 'brunch'],
        likes: 42,
        comments: [
          { userId: 'user-1', text: 'Love this look! Where did you get that sweater?', timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
          { userId: 'user-3', text: 'Perfect autumn vibes! 🍂', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString() },
          { userId: 'user-4', text: 'Those jeans fit you perfectly!', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() }
        ],
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'visible' as const,
        reports: []
      },
      {
        id: 'mock-2',
        userId: 'user-3',
        image: '/mock/outfit2.jpg',
        caption: 'Office ready! Sometimes simple is best - white shirt and dark pants never fail ✨ Feeling confident and professional today.',
        tags: ['office', 'professional', 'minimal', 'work'],
        likes: 28,
        comments: [
          { userId: 'user-1', text: 'So clean and professional!', timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString() },
          { userId: 'user-2', text: 'Classic combination that always works', timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString() }
        ],
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'visible' as const,
        reports: []
      },
      {
        id: 'mock-3',
        userId: 'user-4',
        image: '/mock/white-tee.jpg',
        caption: 'Classic white tee styling for a relaxed day out. Comfort meets style! 👕 Sometimes the simplest pieces make the biggest impact.',
        tags: ['casual', 'classic', 'comfort', 'basic'],
        likes: 35,
        comments: [
          { userId: 'user-5', text: 'White tees are essential!', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() }
        ],
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'visible' as const,
        reports: []
      },
      {
        id: 'mock-4',
        userId: 'user-5',
        image: '/mock/navy-chino.jpg',
        caption: 'Navy chinos are such a versatile piece! Dressed up with a nice shirt for dinner 🍽️ Love how they work for both casual and formal occasions.',
        tags: ['smart-casual', 'dinner', 'versatile', 'navy'],
        likes: 51,
        comments: [
          { userId: 'user-1', text: 'Great fit!', timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
          { userId: 'user-2', text: 'Those chinos look amazing on you', timestamp: new Date(Date.now() - 50 * 60 * 1000).toISOString() },
          { userId: 'user-3', text: 'Perfect for date night vibes', timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
          { userId: 'user-6', text: 'Navy is such a great color choice', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString() }
        ],
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'visible' as const,
        reports: []
      },
      {
        id: 'mock-5',
        userId: 'user-6',
        image: '/mock/beige-coat.jpg',
        caption: 'Fall vibes with this gorgeous beige coat! Perfect for those crisp autumn days 🍂 The neutral tone goes with everything in my wardrobe.',
        tags: ['fall', 'coat', 'autumn', 'outerwear'],
        likes: 67,
        comments: [
          { userId: 'user-1', text: 'Beautiful coat! Where is it from?', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
          { userId: 'user-7', text: 'Beige coats are timeless', timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString() }
        ],
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'visible' as const,
        reports: []
      },
      {
        id: 'mock-6',
        userId: 'user-7',
        image: '/mock/brown-loafers.jpg',
        caption: 'These brown loafers complete any smart-casual look. Investment piece! 👞 Quality leather that gets better with age.',
        tags: ['shoes', 'loafers', 'smart-casual', 'leather'],
        likes: 33,
        comments: [
          { userId: 'user-2', text: 'Love the quality!', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
          { userId: 'user-4', text: 'Where are these from? Looking for similar ones', timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString() }
        ],
        timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
        status: 'visible' as const,
        reports: []
      }
    ];

    let filteredPosts = [...communityPosts, ...mockPosts];

    // Apply filters
    if (selectedTag) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.includes(selectedTag)
      );
    }

    if (searchQuery) {
      filteredPosts = filteredPosts.filter(post => 
        post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (timeFilter !== 'all') {
      const now = new Date();
      const filterTime = timeFilter === 'week' ? 7 * 24 * 60 * 60 * 1000 :
                        timeFilter === 'month' ? 30 * 24 * 60 * 60 * 1000 :
                        24 * 60 * 60 * 1000; // today
      
      filteredPosts = filteredPosts.filter(post => 
        post.timestamp && (now.getTime() - new Date(post.timestamp).getTime()) < filterTime
      );
    }

    // Sort based on active tab
    if (activeTab === 'trending') {
      filteredPosts.sort((a, b) => (b.likes + b.comments.length * 2) - (a.likes + a.comments.length * 2));
    } else {
      filteredPosts.sort((a, b) => 
        new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
      );
    }

    setPosts(filteredPosts);
    setIsLoading(false);
  };

  const handleLikePost = (postId: string) => {
    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    );
    setPosts(updatedPosts);
    
    toast({
      title: "Post liked!",
      description: "Your like has been added"
    });
  };

  const handleReportPost = (postId: string, reason: string) => {
    reportPost(postId, reason, currentUser.id);
    toast({
      title: "Post reported",
      description: "Thank you for reporting. We'll review this content."
    });
  };

  const handleCreatePost = (postData: { caption: string; tags: string[]; image: string }) => {
    const newPost = addPost({
      userId: currentUser.id,
      image: postData.image,
      caption: postData.caption,
      tags: postData.tags,
      comments: [],
      status: 'visible' as const,
      reports: []
    });
    
    setPosts([newPost, ...posts]);
    setIsNewPostOpen(false);
    
    toast({
      title: "Post created!",
      description: "Your outfit has been shared with the community"
    });
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
    setTimeFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/10">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Style Community
                  </h1>
                  <p className="text-lg text-muted-foreground mt-1">
                    Discover, share, and get inspired by fashion looks
                  </p>
                </div>
                
                <Dialog open={isNewPostOpen} onOpenChange={setIsNewPostOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all duration-200">
                      <Plus className="w-5 h-5 mr-2" />
                      Share Look
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <NewPostDialog onCreatePost={handleCreatePost} />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Stats Bar */}
              <StatsBar />

              {/* Hashtag Cloud */}
              <HashtagCloud 
                selectedTag={selectedTag}
                onTagClick={setSelectedTag}
              />

              {/* Tabs */}
              <CommunityTabs 
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />

              {/* Weekly Challenge Widget */}
              <WeeklyChallengeWidget challenge={activeChallenge} />

              {/* Search & Filters */}
              <SearchFilters
                searchQuery={searchQuery}
                selectedTag={selectedTag}
                timeFilter={timeFilter}
                onSearchChange={setSearchQuery}
                onTagChange={setSelectedTag}
                onTimeFilterChange={setTimeFilter}
                onClearAll={handleClearAllFilters}
              />
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {isLoading ? (
                // Skeleton Loading
                Array.from({ length: 3 }).map((_, index) => (
                  <PostSkeleton key={index} />
                ))
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <EnhancedPostCard
                    key={post.id}
                    post={post}
                    currentUser={currentUser}
                    onLike={() => handleLikePost(post.id)}
                    onReport={(reason) => handleReportPost(post.id, reason)}
                  />
                ))
              ) : (
                // Empty State
                <div className="text-center py-16">
                  <div className="space-y-6 max-w-md mx-auto">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto">
                        <ImageIcon className="w-12 h-12 text-primary" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">No posts found</h3>
                      <p className="text-muted-foreground text-lg">
                        {searchQuery || selectedTag || timeFilter !== 'all' 
                          ? 'Try adjusting your filters or search terms'
                          : 'Be the first to share your amazing style with the community!'
                        }
                      </p>
                    </div>
                    <Button 
                      onClick={() => setIsNewPostOpen(true)}
                      className="bg-gradient-to-r from-primary to-accent"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Share your first look
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar (hidden on mobile) */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  );
}