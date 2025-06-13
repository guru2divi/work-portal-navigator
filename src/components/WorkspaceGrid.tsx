
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  onDeleteWorkspace?: (workspaceId: string) => void;
}

const WorkspaceGrid = ({ filteredWorkspaces, user, onWorkspaceClick, onDeleteWorkspace }: WorkspaceGridProps) => {
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

  const handleDeleteWorkspace = (workspaceId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDeleteWorkspace) {
      onDeleteWorkspace(workspaceId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredWorkspaces.map(([key, config]) => {
        const Icon = config.icon;
        
        return (
          <Card 
            key={key}
            className={`transition-all duration-200 cursor-pointer hover:shadow-lg hover:scale-105 border-2 ${config.lightColor} relative`}
            onClick={() => onWorkspaceClick(key)}
          >
            {user.role === 'admin' && onDeleteWorkspace && (
              <div className="absolute top-2 right-2 z-10">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the "{config.title}" workspace? This action cannot be undone and will remove access for all users.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600"
                        onClick={(e) => handleDeleteWorkspace(key, e)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
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
