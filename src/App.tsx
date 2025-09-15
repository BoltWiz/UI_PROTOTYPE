import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StylistLayout } from "@/components/stylist/StylistLayout";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import Wardrobe from "@/pages/Wardrobe";
import Suggest from "@/pages/Suggest";
import Daily from "@/pages/Daily";
import History from "@/pages/History";
import Favorites from "@/pages/Favorites";
import Community from "@/pages/Community";
import Moderation from "@/pages/Moderation";
import Collections from "@/pages/Collections";
import CollectionDetail from "@/pages/CollectionDetail";

// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminUsers from "@/pages/admin/Users";
import AdminReports from "@/pages/admin/Reports";
import AdminSystem from "@/pages/admin/System";
import ReportDetail from "@/pages/admin/ReportDetail";

// Stylist Pages
import StylistDashboard from "@/pages/stylist/Dashboard";
import StylistCollections from "@/pages/stylist/Collections";
import StylistTips from "@/pages/stylist/Tips";
import StylistRequests from "@/pages/stylist/Requests";
import StylistPosts from "@/pages/stylist/Posts";
import StylistSettings from "@/pages/stylist/Settings";
import CollectionsNew from "@/pages/stylist/CollectionsNew";
import CollectionsEdit from "@/pages/stylist/CollectionsEdit";

import CommunityTrends from "@/pages/CommunityTrends";
import Challenges from "@/pages/Challenges";
import ChallengeDetail from "@/pages/ChallengeDetail";
import AdminChallenges from "@/pages/admin/AdminChallenges";
import NotFound from "@/pages/NotFound";
import Welcome from "@/pages/Welcome";
import ChallengeManagement from "@/pages/admin/ChallengeManagement";
import Profile from "@/pages/Profile";
import { RouteGuard } from "@/components/RouteGuard";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/collections" element={<Layout><Collections /></Layout>} />
        <Route path="/collections/:id" element={<Layout><CollectionDetail /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Role-based redirect for root path
  const getRoleBasedRedirect = () => {
    if (!user) return "/wardrobe";
    
    switch (user.role) {
      case 'admin':
        return "/admin/dashboard";
      case 'stylist':
        return "/stylist";
      default:
        return "/wardrobe";
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={getRoleBasedRedirect()} replace />} />
      
      {/* User Routes with Layout */}
      <Route path="/wardrobe" element={<Layout><Wardrobe /></Layout>} />
      <Route path="/suggest" element={<Layout><Suggest /></Layout>} />
      <Route path="/daily" element={<Layout><Daily /></Layout>} />
      <Route path="/history" element={<Layout><History /></Layout>} />
      <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
      <Route path="/community" element={<Layout><Community /></Layout>} />
      <Route path="/community/trends" element={<Layout><CommunityTrends /></Layout>} />
      <Route path="/challenges" element={<Layout><Challenges /></Layout>} />
      <Route path="/challenges/:slug" element={<Layout><ChallengeDetail /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      
      {/* Public Collections Routes */}
      <Route path="/collections" element={<Layout><Collections /></Layout>} />
      <Route path="/collections/:id" element={<Layout><CollectionDetail /></Layout>} />
      
      {/* Stylist Routes with StylistLayout */}
      <Route path="/stylist" element={<RouteGuard allowedRoles={['stylist']}><StylistLayout><StylistDashboard /></StylistLayout></RouteGuard>} />
      <Route path="/stylist/collections" element={<RouteGuard allowedRoles={['stylist']}><StylistLayout><StylistCollections /></StylistLayout></RouteGuard>} />
      <Route path="/stylist/collections/new" element={<RouteGuard allowedRoles={['stylist']}><StylistLayout><CollectionsNew /></StylistLayout></RouteGuard>} />
      <Route path="/stylist/collections/:id/edit" element={<RouteGuard allowedRoles={['stylist']}><StylistLayout><CollectionsEdit /></StylistLayout></RouteGuard>} />
      <Route path="/stylist/tips" element={<RouteGuard allowedRoles={['stylist']}><StylistLayout><StylistTips /></StylistLayout></RouteGuard>} />
      <Route path="/stylist/requests" element={<RouteGuard allowedRoles={['stylist']}><StylistLayout><StylistRequests /></StylistLayout></RouteGuard>} />
      <Route path="/stylist/posts" element={<RouteGuard allowedRoles={['stylist']}><StylistLayout><StylistPosts /></StylistLayout></RouteGuard>} />
      <Route path="/stylist/settings" element={<RouteGuard allowedRoles={['stylist']}><StylistLayout><StylistSettings /></StylistLayout></RouteGuard>} />
      
      {/* Admin Routes with AdminLayout */}
      <Route path="/admin/dashboard" element={<RouteGuard allowedRoles={['admin']}><AdminLayout><AdminDashboard /></AdminLayout></RouteGuard>} />
      <Route path="/admin/users" element={<RouteGuard allowedRoles={['admin']}><AdminLayout><AdminUsers /></AdminLayout></RouteGuard>} />
      <Route path="/admin/moderation" element={<RouteGuard allowedRoles={['admin']}><AdminLayout><Moderation /></AdminLayout></RouteGuard>} />
      <Route path="/admin/reports" element={<RouteGuard allowedRoles={['admin']}><AdminLayout><AdminReports /></AdminLayout></RouteGuard>} />
      <Route path="/admin/reports/:reportId" element={<RouteGuard allowedRoles={['admin']}><AdminLayout><ReportDetail /></AdminLayout></RouteGuard>} />
      <Route path="/admin/challenges" element={<RouteGuard allowedRoles={['admin']}><AdminLayout><AdminChallenges /></AdminLayout></RouteGuard>} />
      <Route path="/admin/system" element={<RouteGuard allowedRoles={['admin']}><AdminLayout><AdminSystem /></AdminLayout></RouteGuard>} />
      <Route path="/admin/challenge-management" element={<RouteGuard allowedRoles={['admin']}><AdminLayout><ChallengeManagement /></AdminLayout></RouteGuard>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
