import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, FileText, Users, Shield } from "lucide-react";
import Dashboard from "@/components/Dashboard";

interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  workspaces: string[];
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  // Mock users for demonstration
  const mockUsers: User[] = [
    { id: "1", username: "admin", role: "admin", workspaces: ["dev", "qa", "review", "admin", "data", "docs", "planning"] },
    { id: "2", username: "dev-lead", role: "editor", workspaces: ["dev", "docs", "planning"] },
    { id: "3", username: "qa-manager", role: "editor", workspaces: ["qa", "docs"] },
    { id: "4", username: "reviewer", role: "editor", workspaces: ["review", "docs"] },
    { id: "5", username: "data-analyst", role: "editor", workspaces: ["data", "docs"] },
    { id: "6", username: "project-manager", role: "editor", workspaces: ["planning", "docs", "admin"] },
    { id: "7", username: "viewer", role: "viewer", workspaces: ["dev", "qa", "review", "docs"] }
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = () => {
    // Simple authentication (in real app, this would be server-side)
    const passwords: { [key: string]: string } = {
      "admin": "admin123",
      "dev-lead": "dev123",
      "qa-manager": "qa123",
      "reviewer": "review123",
      "data-analyst": "data123",
      "project-manager": "pm123",
      "viewer": "view123"
    };

    const user = mockUsers.find(u => u.username === username);
    
    if (user && passwords[username] === password) {
      setCurrentUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.username}!`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  if (currentUser) {
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <Building2 className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">WorkSpace Hub</h1>
          </div>
          <p className="text-xl text-gray-600 leading-relaxed">
            Secure file management system for development teams. Organize, share, and collaborate on files with role-based access control.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-900">File Management</h3>
                <p className="text-sm text-gray-600">Upload, organize, delete</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Team Workspaces</h3>
                <p className="text-sm text-gray-600">Dev, QA, Review & More</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm">
              <Shield className="h-8 w-8 text-purple-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Role-Based Access</h3>
                <p className="text-sm text-gray-600">Secure permissions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full max-w-md mx-auto shadow-xl border-0">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="h-11"
              />
            </div>
            
            <Button 
              onClick={handleLogin} 
              className="w-full h-11 text-base font-medium"
              disabled={!username || !password}
            >
              Sign In
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Demo Accounts:</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>admin / admin123</span>
                  <span className="text-blue-600 font-medium">Full Access</span>
                </div>
                <div className="flex justify-between">
                  <span>dev-lead / dev123</span>
                  <span className="text-green-600 font-medium">Dev Editor</span>
                </div>
                <div className="flex justify-between">
                  <span>qa-manager / qa123</span>
                  <span className="text-orange-600 font-medium">QA Editor</span>
                </div>
                <div className="flex justify-between">
                  <span>data-analyst / data123</span>
                  <span className="text-indigo-600 font-medium">Data Editor</span>
                </div>
                <div className="flex justify-between">
                  <span>project-manager / pm123</span>
                  <span className="text-teal-600 font-medium">Planning Editor</span>
                </div>
                <div className="flex justify-between">
                  <span>viewer / view123</span>
                  <span className="text-gray-600 font-medium">View Only</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
