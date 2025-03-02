/* eslint-disable @next/next/no-img-element */
'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { LayoutGrid, TableIcon, XIcon } from 'lucide-react';

import { format } from 'date-fns';
import { Calendar, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@/lib/types';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();

  const { view } = router.query;

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  useEffect(() => {
    if (view === 'grid' || view === 'table') {
      setViewMode(view);
    }
  }, [view]);

  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    if (searchKey && router.query.search) {
      table.getColumn(searchKey)?.setFilterValue(router.query.search);
    }
  }, [searchKey]);

  return (
    <div>
      {searchKey && (
        <div className="flex items-center py-4 w-full justify-between">
          <span className="flex items-center space-x-2 w-full">
            <Input
              placeholder="Search"
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
              }
              onChange={(event) => {
                table.getColumn(searchKey)?.setFilterValue(event.target.value);

                router.push(
                  {
                    query: {
                      ...router.query,
                      search: event.target.value,
                    },
                  },
                  undefined,
                  { shallow: true },
                );
              }}
              className="max-w-sm"
            />

            {router.query.search && (
              <XIcon
                className="h-4 w-4 cursor-pointer text-indigo-300"
                onClick={() => {
                  table.getColumn(searchKey)?.setFilterValue('');
                  router.push(
                    {
                      query: {
                        ...router.query,
                        search: undefined,
                      },
                    },
                    undefined,
                    { shallow: true },
                  );
                }}
              />
            )}
          </span>

          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(value) => {
              if (!value) return;

              setViewMode(value as 'table' | 'grid');

              router.push(
                {
                  query: {
                    ...router.query,
                    view: value,
                  },
                },
                undefined,
                { shallow: true },
              );
            }}
          >
            <ToggleGroupItem value="table" aria-label="Table view">
              <TableIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      )}

      {viewMode === 'table' ? (
        <TableView table={table} columns={columns} />
      ) : (
        <CardView table={table} />
      )}
    </div>
  );
}

function CardView({ table }: { table: any }) {
  if (table.getRowModel().rows.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          No links found. Create your first link!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {table.getRowModel().rows.map((row: any) => {
        const link = row.original;

        const actionCell = row
          .getVisibleCells()
          .find((i: any) => `${i?.id}`.includes('action'));

        return <LinkCard key={link.code} link={link} actionCell={actionCell} />;
      })}
    </div>
  );
}

interface LinkCardProps {
  link: Link;
  actionCell: any;
}

export function LinkCard({ link, actionCell }: LinkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const redirectLink = `${process.env.NEXT_PUBLIC_CLOUDFLARE_REDIRECTOR}/${link?.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(redirectLink);

    toast.success('Link copied to clipboard');
  };

  const fallbackImage =
    'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=500&auto=format&fit=crop';

  return (
    <Card
      className="h-full flex flex-col transition-all duration-200 hover:shadow-md overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Cover Image */}
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <div className="w-full h-full bg-muted overflow-hidden">
            {link?.image ? (
              <img
                src={imageError ? fallbackImage : link.image}
                alt={`Cover for ${redirectLink}`}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-indigo-300 to-indigo-800">
                <p className="text-2xl">No Image</p>
              </div>
            )}
          </div>
        </AspectRatio>

        <div className="absolute top-2 left-2">
          <a
            href={`${process.env.NEXT_PUBLIC_CLOUDFLARE_REDIRECTOR}/${link.code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            <Badge
              variant="outline"
              className="bg-indigo-900 hover:bg-indigo-500 text-indigo-50"
            >
              {link.code}
            </Badge>
          </a>
        </div>

        <div className="absolute top-2 right-2">
          {flexRender(
            actionCell.column.columnDef.cell,
            actionCell.getContext(),
          )}
        </div>
      </div>

      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-base truncate">
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
          >
            {redirectLink}
            <ExternalLink className="ml-1 h-3 w-3 inline" />
          </a>
        </CardTitle>
        <p className="text-xs text-muted-foreground truncate">{link.url}</p>
      </CardHeader>

      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-2" />
            <span>Created: {format(new Date(link.time_created), 'PPP')}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-2" />
            <span>Updated: {format(new Date(link.time_updated), 'PPP')}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={handleCopy}
        >
          <Copy className="h-3.5 w-3.5 mr-2" />
          Copy Shortened URL
        </Button>
      </CardFooter>
    </Card>
  );
}
interface TableViewProps {
  table: any;
  columns: ColumnDef<any, any>[];
}

function TableView({ table, columns }: TableViewProps) {
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
