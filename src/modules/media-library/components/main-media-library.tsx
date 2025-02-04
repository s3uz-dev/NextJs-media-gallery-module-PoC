'use client'
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LayoutGrid, List, Trash2, Edit } from 'lucide-react';
import { useMediaAll, useMediaDelete } from '@/modules/media-library/hooks/use-media';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import MediaUploadDialog from './media-upload-dialog';


interface MediaItem {
  id: number;
  name: string;
  createdAt: string;
  url: string;
  type: string;
}

type MediaResponseType = {
  success: boolean;
  data: {
    data: MediaItem[];
    total: number;
    page: number;
    limit: number;
  } | null;
  error?: string;
}

export const MainMediaLibrary = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMediaToDelete, setSelectedMediaToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: mediaData } = useMediaAll({ page, limit, search: searchQuery });
  const deleteMedia = useMediaDelete();

  const isMediaResponse = (response: any): response is MediaResponseType => {
    return response && typeof response.success === 'boolean';
  }

  const formatDate = (dateString: string) => { 
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString();
  };


  const handleBulkSelect = () => {
    if (isMediaResponse(mediaData) && mediaData.success && mediaData.data) {
      const allIds = (mediaData as any).data.data.map((item: any) => item.id);
      setSelectedItems(prev =>
        prev.length === allIds.length ? [] : allIds
      );
    }
  };

  const handleDelete = (id: number) => {
    setSelectedMediaToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!selectedMediaToDelete) return;

    setIsDeleting(true);
    try {
      await deleteMedia.mutateAsync(selectedMediaToDelete);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSelectedMediaToDelete(null);
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredItems = isMediaResponse(mediaData) && mediaData.success && mediaData.data
    ? (mediaData as any).data.data
    : [];

  const totalItems = isMediaResponse(mediaData) && mediaData.success && mediaData.data
    ? (mediaData as any).data.total
    : 0;

  return (
    <Card className='max-w-[860px] min-w-[860px]'>
      <CardHeader>

      </CardHeader>
      <CardContent>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button className="hidden">Eliminar</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-foreground">Confirmar eliminación</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-foreground">
                ¿Estás seguro de que deseas eliminar este medio? Esta acción no se puede deshacer.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Eliminando...
                  </>
                ) : 'Confirmar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Controles superiores */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">


            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleBulkSelect}
            >
              {selectedItems.length > 0 ? 'Deseleccion multiple' : 'Seleccion multiple'}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">

            <MediaUploadDialog />
            <div className="flex justify-end sm:justify-start">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-9 w-9 p-0 sm:h-8 sm:w-auto sm:px-2"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-9 w-9 p-0 sm:h-8 sm:w-auto sm:px-2"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Vista de tabla */}
        {viewMode === 'table' ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[40px] text-foreground">
                    <input
                      type="checkbox"
                      checked={selectedItems.length > 0 && selectedItems.length === filteredItems.length}
                      onChange={handleBulkSelect}
                      className="w-4 h-4 rounded border-border"
                    />
                  </TableHead>
                  <TableHead className="text-foreground">Miniatura</TableHead>
                  <TableHead className="text-foreground">Tipo</TableHead>
                  <TableHead className="text-foreground">Fecha</TableHead>
                  <TableHead className="text-foreground">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item: any) => (
                  <TableRow key={item.id} className="hover:bg-accent/50">
                    <TableCell className="py-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                        className="w-4 h-4 rounded border-border"
                      />
                    </TableCell>
                    <TableCell className="py-2">
                      <img
                        src={item.url}
                        alt={item.id}
                        className="w-10 h-10 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="py-2 text-foreground">{item.type}</TableCell>
                    <TableCell className="py-2 text-foreground">
                      {formatDate(item.created_at)}
                    </TableCell>
                    <TableCell className="py-2 flex gap-2">
                      <Button variant="ghost" size="sm" className="hover:text-primary">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive/80"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          // Vista de bloques
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
            {filteredItems.map((item: any) => (
              <div
                key={item.id}
                className="relative group border rounded-lg overflow-hidden aspect-square"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay de información */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <div className="text-white text-center">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs mt-1">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="absolute bottom-2 right-2 flex gap-2">
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white">
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>

                {/* Checkbox de selección */}
                <div className="absolute top-2 right-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    className="w-4 h-4 rounded border-border bg-background checked:bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación */}
        {mediaData?.success && (
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {(page - 1) * limit + 1} - {Math.min(page * limit, totalItems)} de {totalItems}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= totalItems}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};