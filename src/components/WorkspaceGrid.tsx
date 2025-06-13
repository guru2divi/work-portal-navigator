
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  workspaces: string[];
}

interface WorkspaceConfig {
  title: string;
  description: string;
  icon: any;
  color: string;
  lightColor: string;
}

interface WorkspaceGridProps {
  filteredWorkspaces: [string, WorkspaceConfig][];
  user: User;
  onWorkspaceClick: (workspaceId: string) => void;
}

const WorkspaceGrid = ({ filteredWorkspaces, user, onWorkspaceClick }: WorkspaceGridProps) => {
  if (filteredWorkspaces.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No workspaces available
          </h3>
          <p className="text-gray-500">
            Contact your administrator for workspace access
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredWorkspaces.map(([key, config]) => {
        const Icon = config.icon;
        
        return (
          <Card 
            key={key}
            className={`transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 border-2 ${config.lightColor}`}
            onClick={() => onWorkspaceClick(key)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{config.title}</CardTitle>
                  <Badge variant="outline" className="text-xs mt-1">
                    {user.role === 'viewer' ? 'View Only' : 'Full Access'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {config.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WorkspaceGrid;
