import { useState, useEffect } from 'react';
import { Search, Filter, Ban, Shield, CheckCircle, MoreHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { DataTable, Column } from '@/components/admin/DataTable';
import { useToast } from '@/hooks/use-toast';
import { getAdminUsers, updateUserStatus, updateUserRole } from '@/lib/admin';
import { AdminUser, Role, UserStatus } from '@/types/admin';
import { formatDistanceToNow } from 'date-fns';

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, [searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm || undefined,
        role: roleFilter !== 'all' ? roleFilter as Role : undefined,
        status: statusFilter !== 'all' ? statusFilter as UserStatus : undefined,
      };
      const result = getAdminUsers(params);
      setUsers(result.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId: string, action: 'ban' | 'unban' | 'verify') => {
    try {
      if (action === 'ban') {
        await updateUserStatus(userId, 'banned', 'Admin action');
      } else if (action === 'unban') {
        await updateUserStatus(userId, 'active');
      } else if (action === 'verify') {
        await updateUserStatus(userId, 'verified');
      }

      toast({
        title: "Success",
        description: `User ${action}${action.endsWith('y') ? 'ied' : 'ned'} successfully`
      });
      
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive"
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      await updateUserRole(userId, newRole, 'Admin role change');
      toast({
        title: "Success",
        description: `User role updated to ${newRole}`
      });
      loadUsers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeVariant = (role: Role) => {
    switch (role) {
      case 'admin': return 'default';
      case 'stylist': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'default';
      case 'verified': return 'secondary';
      case 'banned': return 'destructive';
      case 'flagged': return 'destructive';
      default: return 'outline';
    }
  };

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      label: 'User',
      render: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
      width: '300px'
    },
    {
      key: 'role',
      label: 'Role',
      render: (user) => (
        <Badge variant={getRoleBadgeVariant(user.role)}>
          {user.role}
        </Badge>
      ),
      width: '100px'
    },
    {
      key: 'status',
      label: 'Status',
      render: (user) => (
        <Badge variant={getStatusBadgeVariant(user.status)}>
          {user.status}
        </Badge>
      ),
      width: '100px'
    },
    {
      key: 'postsCount',
      label: 'Posts',
      render: (user) => user.postsCount || 0,
      width: '80px'
    },
    {
      key: 'lastSeen',
      label: 'Last Seen',
      render: (user) => user.lastSeen 
        ? formatDistanceToNow(new Date(user.lastSeen), { addSuffix: true })
        : 'Never',
      width: '150px'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.status !== 'banned' && (
              <DropdownMenuItem 
                onClick={() => handleUserAction(user.id, 'ban')}
                className="text-destructive"
              >
                <Ban className="w-4 h-4 mr-2" />
                Ban User
              </DropdownMenuItem>
            )}
            {user.status === 'banned' && (
              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'unban')}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Unban User
              </DropdownMenuItem>
            )}
            {user.status !== 'verified' && (
              <DropdownMenuItem onClick={() => handleUserAction(user.id, 'verify')}>
                <Shield className="w-4 h-4 mr-2" />
                Verify User
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'user')}>
              Set as User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'stylist')}>
              Set as Stylist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      width: '100px'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage user accounts, roles, and permissions
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="stylist">Stylist</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="banned">Banned</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Data Table */}
      <DataTable
        data={users}
        columns={columns}
        loading={loading}
        emptyMessage="No users found"
        onRowClick={setSelectedUser}
      />

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant={getStatusBadgeVariant(selectedUser.status)}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Posts Count</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.postsCount || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Reports Count</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.reportsCount || 0}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created At</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Seen</label>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.lastSeen 
                      ? formatDistanceToNow(new Date(selectedUser.lastSeen), { addSuffix: true })
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}