
import { useState } from "react";
import { Code, Bug, Eye, Settings, Database, FileText, Clipboard } from "lucide-react";
import Workspace from "./Workspace";
import AdminActivityPanel from "./AdminActivityPanel";
import DashboardHeader from "./DashboardHeader";
import SearchAndActions from "./SearchAndActions";
import WorkspaceGrid from "./WorkspaceGrid";
import RoleInfoCard from "./RoleInfoCard";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Initial workspaces - can be expanded dynamically
  const [workspaceConfig, setWorkspaceConfig] = useState({
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
  });

  // Store all users for workspace permission management
  const [allUsers] = useState<User[]>([
    { id: "1", username: "admin", role: "admin", workspaces: ["dev", "qa", "review", "admin", "data", "docs", "planning"] },
    { id: "2", username: "dev-lead", role: "editor", workspaces: ["dev", "docs", "planning"] },
    { id: "3", username: "qa-manager", role: "editor", workspaces: ["qa", "docs"] },
    { id: "4", username: "reviewer", role: "editor", workspaces: ["review", "docs"] },
    { id: "5", username: "data-analyst", role: "editor", workspaces: ["data", "docs"] },
    { id: "6", username: "project-manager", role: "editor", workspaces: ["planning", "docs", "admin"] },
    { id: "7", username: "viewer", role: "viewer", workspaces: ["dev", "qa", "review", "docs"] }
  ]);

  const handleAddWorkspace = (workspaceData: any) => {
    setWorkspaceConfig(prev => ({
      ...prev,
      [workspaceData.id]: workspaceData.config
    }));
    console.log('New workspace created:', workspaceData);
  };

  // Filter workspaces based on search term
  const filteredWorkspaces = Object.entries(workspaceConfig).filter(([key, config]) => {
    const hasAccess = user.workspaces.includes(key);
    const matchesSearch = config.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.description.toLowerCase().includes(searchTerm.toLowerCase());
    return hasAccess && matchesSearch;
  });

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

  if (showAdminPanel && user.role === 'admin') {
    return (
      <AdminActivityPanel
        users={allUsers}
        onBack={() => setShowAdminPanel(false)}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader 
        user={user}
        onLogout={onLogout}
        onShowAdminPanel={() => setShowAdminPanel(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Workspaces</h2>
          <p className="text-gray-600">Select a workspace to manage files and collaborate with your team.</p>
        </div>

        <SearchAndActions
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          user={user}
          allUsers={allUsers}
          onAddWorkspace={handleAddWorkspace}
        />

        <WorkspaceGrid
          filteredWorkspaces={filteredWorkspaces}
          user={user}
          onWorkspaceClick={setActiveWorkspace}
        />

        <RoleInfoCard />
      </main>
    </div>
  );
};

export default Dashboard;
