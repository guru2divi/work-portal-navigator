
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, LogOut, Users, Activity } from "lucide-react";

interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  workspaces: string[];
}

interface DashboardHeaderProps {
  user: User;
  onLogout: () => void;
  onShowAdminPanel: () => void;
}

const DashboardHeader = ({ user, onLogout, onShowAdminPanel }: DashboardHeaderProps) => {
  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-red-100 text-red-800 border-red-200",
      editor: "bg-blue-100 text-blue-800 border-blue-200", 
      viewer: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return variants[role as keyof typeof variants] || variants.viewer;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">WorkSpace Hub</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {user.role === 'admin' && (
              <Button variant="outline" size="sm" onClick={onShowAdminPanel}>
                <Activity className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            )}
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
  );
};

export default DashboardHeader;
