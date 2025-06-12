import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, LogOut, Users, FileText, Shield, Code, Bug, Eye, Settings, Database, Clipboard } from "lucide-react";
import Workspace from "./Workspace";

interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  workspaces: string[];
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);

  const workspaceConfig = {
    dev: {
      title: "Development",
      description: "Source code, documentation, and development assets",
      icon: Code,
      color: "bg-blue-500",
      lightColor: "bg-blue-50 border-blue-200"
    },
    qa: {
      title: "Quality Assurance", 
      description: "Test cases, bug reports, and quality documentation",
      icon: Bug,
      color: "bg-green-500",
      lightColor: "bg-green-50 border-green-200"
    },
    review: {
      title: "Review & Approval",
      description: "Documents for review, approvals, and sign-offs",
      icon: Eye,
      color: "bg-purple-500",
      lightColor: "bg-purple-50 border-purple-200"
    },
    admin: {
      title: "Administration",
      description: "System settings, user management, and configurations",
      icon: Settings,
      color: "bg-red-500",
      lightColor: "bg-red-50 border-red-200"
    },
    data: {
      title: "Data Management",
      description: "Database files, data analysis, and reports",
      icon: Database,
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50 border-indigo-200"
    },
    docs: {
      title: "Documentation",
      description: "User manuals, technical docs, and project specifications",
      icon: FileText,
      color: "bg-orange-500",
      lightColor: "bg-orange-50 border-orange-200"
    },
    planning: {
      title: "Project Planning",
      description: "Project plans, timelines, and resource allocation",
      icon: Clipboard,
      color: "bg-teal-500",
      lightColor: "bg-teal-50 border-teal-200"
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-red-100 text-red-800 border-red-200",
      editor: "bg-blue-100 text-blue-800 border-blue-200", 
      viewer: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return variants[role as keyof typeof variants] || variants.viewer;
  };

  if (activeWorkspace) {
    return (
      <Workspace
        workspaceId={activeWorkspace}
        user={user}
        config={workspaceConfig[activeWorkspace as keyof typeof workspaceConfig]}
        onBack={() => setActiveWorkspace(null)}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">WorkSpace Hub</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user.username}</span>
                <Badge className={`text-xs ${getRoleBadge(user.role)}`}>
                  {user.role.toUpperCase()}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Workspaces</h2>
          <p className="text-gray-600">Select a workspace to manage files and collaborate with your team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(workspaceConfig).map(([key, config]) => {
            const hasAccess = user.workspaces.includes(key);
            const Icon = config.icon;
            
            return (
              <Card 
                key={key}
                className={`transition-all duration-200 cursor-pointer ${
                  hasAccess 
                    ? 'hover:shadow-lg hover:scale-105 border-2' 
                    : 'opacity-50 cursor-not-allowed'
                } ${config.lightColor}`}
                onClick={() => hasAccess && setActiveWorkspace(key)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{config.title}</CardTitle>
                      {hasAccess && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {user.role === 'viewer' ? 'View Only' : 'Full Access'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {config.description}
                  </CardDescription>
                  {!hasAccess && (
                    <div className="flex items-center space-x-2 mt-3 text-xs text-gray-500">
                      <Shield className="h-4 w-4" />
                      <span>Access Restricted</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Role Information */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-900">
              <Shield className="h-5 w-5" />
              <span>Access Level Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">Admin</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Access all workspaces</li>
                  <li>• Upload & delete files</li>
                  <li>• Manage user permissions</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">Editor</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Access assigned workspaces</li>
                  <li>• Upload & delete files</li>
                  <li>• Search and organize</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-900">Viewer</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• View files only</li>
                  <li>• Search and download</li>
                  <li>• No upload/delete access</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
