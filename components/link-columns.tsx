import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

import { Link } from '@/lib/types';
import { LinkActions } from '@/components/link-actions';
import { Badge } from '@/components/ui/badge';

export const columns: (
  onEdit: (link: Link) => void,
  onDelete: () => void,
) => ColumnDef<Link>[] = (onEdit, onDelete) => [
  {
    accessorKey: 'code',
    header: 'Code',
    cell: ({ row }) => {
      const code = row.getValue('code') as string;

      return (
        <a
          href={`${process.env.NEXT_PUBLIC_CLOUDFLARE_REDIRECTOR}/${code}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          <Badge
            variant="outline"
            className="bg-indigo-900 hover:bg-indigo-500 text-indigo-50"
          >
            {code}
          </Badge>
        </a>
      );
    },
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => {
      const url = row.getValue('url') as string;
      return (
        <div className="max-w-[300px] truncate">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {url}
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: 'time_created',
    header: 'Created',
    cell: ({ row }) => {
      const date = new Date(row.getValue('time_created'));
      return <div>{format(date, 'PPP')}</div>;
    },
  },
  {
    accessorKey: 'time_updated',
    header: 'Updated',
    cell: ({ row }) => {
      const date = new Date(row.getValue('time_updated'));
      return <div>{format(date, 'PPP')}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const link = row.original;
      return (
        <LinkActions
          data={link}
          onEdit={() => onEdit(link)}
          onDelete={onDelete}
        />
      );
    },
  },
];
