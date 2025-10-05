"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useResources } from "@/lib/hooks/use-resources";
import {
  FileText,
  LinkIcon,
  Trash2,
  ExternalLink,
  Download,
} from "lucide-react";
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

interface ResourceListProps {
  companyId: string;
  canDelete?: boolean;
}

export function ResourceList({
  companyId,
  canDelete = true,
}: ResourceListProps) {
  const { resources, isLoading, removeResource } = useResources(companyId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <span className="animate-spin text-4xl">⏳</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (resources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Resources</CardTitle>
          <CardDescription>No resources uploaded yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Resources</CardTitle>
        <CardDescription>
          {resources.length} resource(s) available
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="flex items-start justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {resource.type === "file" ? (
                  <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                ) : (
                  <LinkIcon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{resource.title}</h3>
                  {resource.type === "url" && resource.url && (
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:underline flex items-center gap-1 mt-1"
                    >
                      <span className="truncate">{resource.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  )}

                  <p className="text-xs text-muted-foreground mt-1">
                    Added {new Date(resource.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {resource.type === "file" && resource.fileUrl && (
                  <Button
                    variant="link"
                    size="sm"
                    className="text-xs text-muted-foreground hover:underline p-0 h-auto font-normal flex items-center gap-1 mt-1"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = resource.fileUrl!;
                      link.download = resource.title;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="w-3 h-3 shrink-0" />
                    <span className="truncate"></span>
                  </Button>
                )}
                {canDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{resource.title}"?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeResource(resource.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
