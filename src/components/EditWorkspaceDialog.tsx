
import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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

interface EditWorkspaceDialogProps {
  openTrigger: React.ReactNode;
  workspaceId: string;
  config: WorkspaceConfig;
  allUsers: User[];
  currentAccessIds: string[];
  onSave: (workspaceId: string, updatedData: any) => void;
}

const EditWorkspaceDialog = ({
  openTrigger,
  workspaceId,
  config,
  allUsers,
  currentAccessIds,
  onSave,
}: EditWorkspaceDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(config.title);
  const [description, setDescription] = useState(config.description);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(currentAccessIds);

  const handleToggleUser = (id: string) => {
    if (selectedUserIds.includes(id)) {
      setSelectedUserIds(selectedUserIds.filter(u => u !== id));
    } else {
      setSelectedUserIds([...selectedUserIds, id]);
    }
  };

  const handleSave = () => {
    onSave(workspaceId, {
      config: { title, description },
      users: selectedUserIds,
      // Advanced: add support for role-per-workspace here if needed.
    });
    setOpen(false);
  };

  // Optionally allow color/icon edit later.

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{openTrigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Workspace</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">User Access</label>
            <div className="flex flex-wrap gap-1">
              {allUsers.map(u => (
                <button
                  type="button"
                  key={u.id}
                  className={`border rounded px-2 py-1 text-xs focus:outline-none ${selectedUserIds.includes(u.id) ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
                  onClick={() => handleToggleUser(u.id)}
                >
                  @{u.username} <Badge variant="outline" className="ml-1">{u.role}</Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditWorkspaceDialog;

