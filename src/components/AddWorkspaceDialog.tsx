
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Code, Bug, Eye, Settings, Database, FileText, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  workspaces: string[];
}

interface AddWorkspaceDialogProps {
  users: User[];
  onAddWorkspace: (workspaceData: any) => void;
}

const AddWorkspaceDialog = ({ users, onAddWorkspace }: AddWorkspaceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("FileText");
  const [selectedColor, setSelectedColor] = useState("bg-blue-500");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { toast } = useToast();

  const iconOptions = [
    { name: "Code", icon: Code, label: "Development" },
    { name: "Bug", icon: Bug, label: "Testing" },
    { name: "Eye", icon: Eye, label: "Review" },
    { name: "Settings", icon: Settings, label: "Administration" },
    { name: "Database", icon: Database, label: "Data" },
    { name: "FileText", icon: FileText, label: "Documentation" },
    { name: "Clipboard", icon: Clipboard, label: "Planning" }
  ];

  const colorOptions = [
    { value: "bg-blue-500", light: "bg-blue-50 border-blue-200", label: "Blue" },
    { value: "bg-green-500", light: "bg-green-50 border-green-200", label: "Green" },
    { value: "bg-purple-500", light: "bg-purple-50 border-purple-200", label: "Purple" },
    { value: "bg-red-500", light: "bg-red-50 border-red-200", label: "Red" },
    { value: "bg-indigo-500", light: "bg-indigo-50 border-indigo-200", label: "Indigo" },
    { value: "bg-orange-500", light: "bg-orange-50 border-orange-200", label: "Orange" },
    { value: "bg-teal-500", light: "bg-teal-50 border-teal-200", label: "Teal" },
    { value: "bg-pink-500", light: "bg-pink-50 border-pink-200", label: "Pink" }
  ];

  const handleSubmit = () => {
    if (!workspaceId || !title || !description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const selectedColorObj = colorOptions.find(c => c.value === selectedColor);
    const selectedIconObj = iconOptions.find(i => i.name === selectedIcon);

    const newWorkspace = {
      id: workspaceId.toLowerCase().replace(/\s+/g, '-'),
      config: {
        title,
        description,
        icon: selectedIconObj?.icon || FileText,
        color: selectedColor,
        lightColor: selectedColorObj?.light || "bg-blue-50 border-blue-200"
      },
      users: selectedUsers
    };

    onAddWorkspace(newWorkspace);
    
    // Reset form
    setWorkspaceId("");
    setTitle("");
    setDescription("");
    setSelectedIcon("FileText");
    setSelectedColor("bg-blue-500");
    setSelectedUsers([]);
    setOpen(false);

    toast({
      title: "Workspace Created",
      description: `${title} workspace has been successfully created`,
    });
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Add New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Workspace</DialogTitle>
          <DialogDescription>
            Add a new workspace and configure user permissions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workspaceId">Workspace ID*</Label>
              <Input
                id="workspaceId"
                placeholder="e.g., frontend-dev"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title*</Label>
              <Input
                id="title"
                placeholder="e.g., Frontend Development"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              placeholder="Describe what this workspace is used for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.name} value={option.name}>
                        <div className="flex items-center space-x-2">
                          <Icon className="h-4 w-4" />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded ${option.value}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>User Access Permissions</Label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded-md p-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={user.id}
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => toggleUserSelection(user.id)}
                  />
                  <label htmlFor={user.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{user.username}</span>
                      <Badge variant="outline" className="text-xs">
                        {user.role.toUpperCase()}
                      </Badge>
                    </div>
                  </label>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Selected users: {selectedUsers.length}
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Workspace
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkspaceDialog;
