import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Shield, UserCheck } from 'lucide-react';

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles: Array<'user' | 'admin' | 'stylist'>;
  fallbackPath?: string;
}

export function RouteGuard({ children, allowedRoles, fallbackPath = '/wardrobe' }: RouteGuardProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <div className="flex justify-center mb-4">
            {allowedRoles.includes('admin') ? (
              <Shield className="w-12 h-12 text-muted-foreground" />
            ) : (
              <UserCheck className="w-12 h-12 text-muted-foreground" />
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You need {allowedRoles.join(' or ')} privileges to access this page.
          </p>
          <p className="text-sm text-muted-foreground">
            Your current role: {user?.role}
          </p>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}