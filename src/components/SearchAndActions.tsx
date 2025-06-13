
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import AddWorkspaceDialog from "./AddWorkspaceDialog";

interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  workspaces: string[];
}

interface SearchAndActionsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  user: User;
  allUsers: User[];
  onAddWorkspace: (workspaceData: any) => void;
}

const SearchAndActions = ({ 
  searchTerm, 
  onSearchChange, 
  user, 
  allUsers, 
  onAddWorkspace 
}: SearchAndActionsProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search workspaces..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {user.role === 'admin' && (
        <AddWorkspaceDialog 
          users={allUsers}
          onAddWorkspace={onAddWorkspace}
        />
      )}
    </div>
  );
};

export default SearchAndActions;
