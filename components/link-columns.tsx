"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

import { Link } from "@/lib/types"
import { LinkActions } from "@/components/link-actions"
import { Badge } from "@/components/ui/badge"

export const columns: (
  onEdit: (link: Link) => void,
  onDelete: () => void
) => ColumnDef<Link>[] = (onEdit, onDelete) => [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => {
      const code = row.getValue("code") as string
      return <Badge variant="outline">{code}</Badge>
    },
  },
  {
    accessorKey: "url",
    header: "URL",
    cell: ({ row }) => {
      const url = row.getValue("url") as string
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
      )
    },
  },
  {
    accessorKey: "time_created",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("time_created"))
      return <div>{format(date, "PPP")}</div>
    },
  },
  {
    accessorKey: "time_updated",
    header: "Updated",
    cell: ({ row }) => {
      const date = new Date(row.getValue("time_updated"))
      return <div>{format(date, "PPP")}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const link = row.original
      return (
        <LinkActions 
          data={link} 
          onEdit={() => onEdit(link)} 
          onDelete={onDelete} 
        />
      )
    },
  },
]