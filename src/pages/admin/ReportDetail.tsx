import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  EyeOff, 
  Ban,
  AlertTriangle,
  Clock,
  User,
  MessageSquare
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import postsData from '@/data/posts.json';
import usersData from '@/data/users.json';
import adminLogsData from '@/data/admin.logs.json';

// Mock report data
const reportData = {
  "r1": {
    id: "r1",
    postId: "p1",
    reason: "Inappropriate content",
    priority: "high",
    reporterId: "u3",
    reporterName: "Emma Davis",
    reporterAvatar: "",
    createdAt: "2024-02-18T10:30:00Z",
    status: "pending",
    description: "This post contains inappropriate language and offensive imagery that violates community guidelines."
  },
  "r2": {
    id: "r2", 
    postId: "p2",
    reason: "Spam/Commercial",
    priority: "medium",
    reporterId: "u2",
    reporterName: "Mike Chen",
    reporterAvatar: "",
    createdAt: "2024-02-17T15:20:00Z",
    status: "pending",
    description: "User is repeatedly posting promotional content without disclosure."
  }
};

export default function ReportDetail() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [report] = useState(() => reportData[reportId as keyof typeof reportData]);
  const [post] = useState(() => postsData.find(p => p.id === report?.postId));
  const [postUser] = useState(() => usersData.find(u => u.id === post?.userId));
  const [adminLogs] = useState(adminLogsData);
  const [actionReason, setActionReason] = useState('');
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

  // Mock reporter history
  const reporterHistory = [
    {
      id: "rh1",
      postId: "p5",
      reason: "Inappropriate content",
      status: "resolved",
      createdAt: "2024-02-10T14:20:00Z"
    },
    {
      id: "rh2", 
      postId: "p8",
      reason: "Spam",
      status: "dismissed",
      createdAt: "2024-02-05T09:15:00Z"
    }
  ];

  const handleAction = (action: string) => {
    setSelectedAction(action);
    setIsActionDialogOpen(true);
  };

  const executeAction = () => {
    // Mock action execution
    const actionMap = {
      resolve: 'Resolved report - no violation found',
      dismiss: 'Dismissed report - insufficient evidence', 
      hide: 'Post hidden due to policy violation',
      ban: 'User banned for repeated violations'
    };

    // Mock logging to admin.logs.json
    const newLog = {
      id: `log${Date.now()}`,
      adminId: "admin1",
      adminName: "Admin User",
      action: selectedAction.toUpperCase() + '_REPORT',
      targetType: selectedAction === 'ban' ? 'user' : selectedAction === 'hide' ? 'post' : 'report',
      targetId: selectedAction === 'ban' ? post?.userId : selectedAction === 'hide' ? post?.id : report?.id,
      details: actionMap[selectedAction as keyof typeof actionMap] + (actionReason ? ` - ${actionReason}` : ''),
      timestamp: new Date().toISOString()
    };

    console.log('New admin log:', newLog);
    
    toast({
      title: "Hành động đã thực hiện",
      description: actionMap[selectedAction as keyof typeof actionMap],
    });

    setIsActionDialogOpen(false);
    setActionReason('');
    
    // Navigate back to reports list
    setTimeout(() => navigate('/admin/reports'), 1000);
  };

  if (!report || !post) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Không tìm thấy báo cáo</h2>
          <Button onClick={() => navigate('/admin/reports')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800', 
    low: 'bg-green-100 text-green-800'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/admin/reports')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Chi tiết báo cáo</h1>
            <p className="text-muted-foreground">Report ID: {report.id}</p>
          </div>
        </div>
        <Badge className={priorityColors[report.priority as keyof typeof priorityColors]}>
          {report.priority} priority
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reported Post */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Bài viết bị báo cáo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>{postUser?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{postUser?.name || 'Unknown User'}</span>
                    <Badge variant="outline">{postUser?.role || 'user'}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.timestamp).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{post.caption}</p>
                  
                  {/* Post Image */}
                  <div className="aspect-square bg-muted rounded-lg overflow-hidden max-w-md">
                    <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span>{post.likes} likes</span>
                    <span>{post.comments?.length || 0} comments</span>
                    {post.tags && (
                      <div className="flex gap-1">
                        {post.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Thông tin báo cáo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Lý do</label>
                  <p className="font-semibold">{report.reason}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Mức độ ưu tiên</label>
                  <Badge className={priorityColors[report.priority as keyof typeof priorityColors]}>
                    {report.priority}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Người báo cáo</label>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={report.reporterAvatar} />
                      <AvatarFallback>{report.reporterName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="font-semibold">{report.reporterName}</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Thời gian</label>
                  <p className="font-semibold">
                    {new Date(report.createdAt).toLocaleDateString('vi-VN')} {new Date(report.createdAt).toLocaleTimeString('vi-VN')}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Mô tả chi tiết</label>
                <p className="mt-1">{report.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant="default" 
                  onClick={() => handleAction('resolve')}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Giải quyết
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleAction('dismiss')}
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Từ chối
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleAction('hide')}
                  className="flex items-center gap-2"
                >
                  <EyeOff className="w-4 h-4" />
                  Ẩn bài viết
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleAction('ban')}
                  className="flex items-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Cấm người dùng
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Reporter History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Lịch sử báo cáo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reporterHistory.map((historyItem) => (
                  <div key={historyItem.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{historyItem.reason}</span>
                      <Badge 
                        variant={historyItem.status === 'resolved' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {historyItem.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(historyItem.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adminLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{log.action}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hành động</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Bạn có chắc chắn muốn thực hiện hành động: <strong>{selectedAction}</strong>?</p>
            
            <div>
              <label className="text-sm font-medium">Lý do (tùy chọn)</label>
              <Textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="Nhập lý do cho hành động này..."
                className="mt-1"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={executeAction}>
                Xác nhận
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}