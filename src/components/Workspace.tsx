
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, Upload, Search, Trash2, Download, 
  FileText, Image, File, Users, Building2, LogOut 
} from "lucide-react";
import FileUploader from "./FileUploader";

interface User {
  id: string;
  username: string;
  role: 'admin' | 'editor' | 'viewer';
  workspaces: string[];
}

interface WorkspaceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
  url?: string;
}

interface WorkspaceConfig {
  title: string;
  description: string;
  icon: any;
  color: string;
  lightColor: string;
}

interface WorkspaceProps {
  workspaceId: string;
  user: User;
  config: WorkspaceConfig;
  onBack: () => void;
  onLogout: () => void;
}

const Workspace = ({ workspaceId, user, config, onBack, onLogout }: WorkspaceProps) => {
  const [files, setFiles] = useState<WorkspaceFile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploader, setShowUploader] = useState(false);
  const { toast } = useToast();

  const canEdit = user.role === 'admin' || user.role === 'editor';
  const Icon = config.icon;

  useEffect(() => {
    // Load files from localStorage for this workspace
    const savedFiles = localStorage.getItem(`workspace_files_${workspaceId}`);
    if (savedFiles) {
      const parsedFiles = JSON.parse(savedFiles).map((file: any) => ({
        ...file,
        uploadedAt: new Date(file.uploadedAt)
      }));
      setFiles(parsedFiles);
    }
  }, [workspaceId]);

  const saveFiles = (newFiles: WorkspaceFile[]) => {
    localStorage.setItem(`workspace_files_${workspaceId}`, JSON.stringify(newFiles));
    setFiles(newFiles);
  };

  const handleFileUpload = (uploadedFiles: File[]) => {
    const newFiles: WorkspaceFile[] = uploadedFiles.map(file => ({
      id: Date.now() + Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedBy: user.username,
      uploadedAt: new Date(),
      url: URL.createObjectURL(file)
    }));

    const updatedFiles = [...files, ...newFiles];
    saveFiles(updatedFiles);
    
    toast({
      title: "Files Uploaded",
      description: `${newFiles.length} file(s) uploaded successfully`,
    });
    
    setShowUploader(false);
  };

  const handleDeleteFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId);
    saveFiles(updatedFiles);
    
    toast({
      title: "File Deleted",
      description: "File has been removed from the workspace",
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('text') || type.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-red-100 text-red-800 border-red-200",
      editor: "bg-blue-100 text-blue-800 border-blue-200", 
      viewer: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return variants[role as keyof typeof variants] || variants.viewer;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{config.title}</h1>
                  <p className="text-sm text-gray-500">{config.description}</p>
                </div>
              </div>
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
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">File Management</h2>
            <p className="text-gray-600 mt-1">{files.length} files in workspace</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            
            {canEdit && (
              <Button onClick={() => setShowUploader(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            )}
          </div>
        </div>

        {/* File Upload Modal */}
        {showUploader && (
          <FileUploader
            onUpload={handleFileUpload}
            onCancel={() => setShowUploader(false)}
          />
        )}

        {/* Files Grid */}
        {filteredFiles.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No files found' : 'No files uploaded'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : canEdit 
                    ? 'Upload your first file to get started' 
                    : 'No files available in this workspace'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              
              return (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <FileIcon className="h-8 w-8 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm text-gray-900 truncate" title={file.name}>
                            {file.name}
                          </h3>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-red-500 hover:text-red-700 p-1 h-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500">
                        <p>Uploaded by: {file.uploadedBy}</p>
                        <p>Date: {file.uploadedAt.toLocaleDateString()}</p>
                      </div>
                      
                      {file.url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = file.url!;
                            link.download = file.name;
                            link.click();
                          }}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Workspace Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Workspace Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{files.length}</div>
                <div className="text-sm text-gray-500">Total Files</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}
                </div>
                <div className="text-sm text-gray-500">Total Size</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {new Set(files.map(f => f.uploadedBy)).size}
                </div>
                <div className="text-sm text-gray-500">Contributors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {canEdit ? 'Editor' : 'Viewer'}
                </div>
                <div className="text-sm text-gray-500">Your Access</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Workspace;
