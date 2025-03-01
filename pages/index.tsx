// import Layout from '../components/layout'
// import NestedLayout from '../components/nested-layout'

import { Suspense } from 'react';
import { Toaster } from 'sonner';

import { PlusCircle, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { columns } from '@/components/link-columns';
import { LinkForm } from '@/components/link-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getAllLinks } from '@/lib/api';
import { Link } from '@/lib/types';

function LinksClient() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = await getAllLinks();
      setLinks(data);
    } catch (error) {
      toast.error('Failed to fetch links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleEdit = (link: Link) => {
    setSelectedLink(link);
    setEditDialogOpen(true);
  };

  const linkColumns = columns(handleEdit, fetchLinks);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Your Links</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLinks}
            disabled={loading}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Link
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Links</CardTitle>
          <CardDescription>
            Manage your shortened URLs. Click on actions to edit or delete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable columns={linkColumns} data={links} searchKey="url" />
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Link</DialogTitle>
            <DialogDescription>
              Enter a URL to create a new shortened link.
            </DialogDescription>
          </DialogHeader>
          <LinkForm
            onSuccess={() => {
              setCreateDialogOpen(false);
              fetchLinks();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>
              Update the URL for code: {selectedLink?.code}
            </DialogDescription>
          </DialogHeader>
          {selectedLink && (
            <LinkForm
              initialData={selectedLink}
              onSuccess={() => {
                setEditDialogOpen(false);
                fetchLinks();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default function Page() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Manage Your Links</h2>
        <p className="text-muted-foreground mt-2">
          Create, view, update, and delete your shortened URLs.
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <LinksClient />
      </Suspense>

      <Toaster position="top-center" />
    </main>
  );
}
