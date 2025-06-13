
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const RoleInfoCard = () => {
  return (
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
              <li>• Create new workspaces</li>
              <li>• View activity logs</li>
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
  );
};

export default RoleInfoCard;
