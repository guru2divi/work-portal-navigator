
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Search, Users, Activity, Clock, FileText, LogOut } from "lucide-react";

interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  workspaces: string[];
}

interface ActivityLog {
  id: string;
  username: string;
  action: string;
  workspace: string;
  timestamp: Date;
  details: string;
}

interface AdminActivityPanelProps {
  users: User[];
  onBack: () => void;
  onLogout: () => void;
}

const AdminActivityPanel = ({ users, onBack, onLogout }: AdminActivityPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'users' | 'activity'>('users');

  // Mock activity data - in real app this would come from database
  const [activityLogs] = useState<ActivityLog[]>([
    {
      id: "1",
      username: "dev-lead",
      action: "File Upload",
      workspace: "Development",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      details: "Uploaded component.tsx"
    },
    {
      id: "2", 
      username: "qa-manager",
      action: "File Delete",
      workspace: "Quality Assurance",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      details: "Deleted old-test.pdf"
    },
    {
      id: "3",
      username: "data-analyst",
      action: "Login",
      workspace: "Data Management",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      details: "User logged in"
    },
    {
      id: "4",
      username: "reviewer",
      action: "File Download",
      workspace: "Review & Approval",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      details: "Downloaded review-doc.pdf"
    },
    {
      id: "5",
      username: "project-manager",
      action: "File Upload",
      workspace: "Project Planning",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      details: "Uploaded project-timeline.xlsx"
    }
  ]);

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-red-100 text-red-800 border-red-200",
      editor: "bg-blue-100 text-blue-800 border-blue-200", 
      viewer: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return variants[role as keyof typeof variants] || variants.viewer;
  };

  const getStatusBadge = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - timestamp.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Online</Badge>;
    } else if (diffInHours < 24) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Recent</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Offline</Badge>;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivity = activityLogs.filter(log =>
    log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.workspace.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Workspaces
              </Button>
              <div className="flex items-center space-x-3">
                <Activity className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-4 w-4 mr-2" />
            User Management
          </Button>
          <Button
            variant={activeTab === 'activity' ? 'default' : 'outline'}
            onClick={() => setActiveTab('activity')}
          >
            <FileText className="h-4 w-4 mr-2" />
            Activity Logs
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={activeTab === 'users' ? "Search users..." : "Search activity..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage user accounts and their access levels ({filteredUsers.length} users)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Workspaces</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => {
                    const lastActivity = activityLogs
                      .filter(log => log.username === user.username)
                      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
                    
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>
                          <Badge className={`text-xs ${getRoleBadge(user.role)}`}>
                            {user.role.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {user.workspaces.slice(0, 3).map(workspace => (
                              <Badge key={workspace} variant="outline" className="text-xs">
                                {workspace}
                              </Badge>
                            ))}
                            {user.workspaces.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.workspaces.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {lastActivity ? getStatusBadge(lastActivity.timestamp) : (
                            <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {lastActivity ? formatTimestamp(lastActivity.timestamp) : 'No activity'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>
                Recent user activity across all workspaces ({filteredActivity.length} entries)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Workspace</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivity.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.username}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.workspace}</TableCell>
                      <TableCell className="text-sm text-gray-600">{log.details}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatTimestamp(log.timestamp)}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                  <div className="text-sm text-gray-500">Total Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {users.filter(u => {
                      const lastActivity = activityLogs
                        .filter(log => log.username === u.username)
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
                      if (!lastActivity) return false;
                      const diffInHours = (Date.now() - lastActivity.timestamp.getTime()) / (1000 * 60 * 60);
                      return diffInHours < 24;
                    }).length}
                  </div>
                  <div className="text-sm text-gray-500">Active Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{activityLogs.length}</div>
                  <div className="text-sm text-gray-500">Recent Actions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {activityLogs.filter(log => {
                      const diffInHours = (Date.now() - log.timestamp.getTime()) / (1000 * 60 * 60);
                      return diffInHours < 1;
                    }).length}
                  </div>
                  <div className="text-sm text-gray-500">Last Hour</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminActivityPanel;
