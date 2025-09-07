/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import DeleteDialog from "@/components/dialog/DeleteDialogProps"
import EditMaterialDialog from "../dialog/EditMaterialDialog"
import { useState } from "react"

export interface Material {
  id: number
  name: string
  description: string
  quantity: number
  price: string
}

interface ColumnProps {
  onDelete: (id: number) => void,
  onUpdated?: (updatedMaterial: Material) => void
}

export const materialsColumns = ({ onDelete, onUpdated }: ColumnProps): ColumnDef<Material>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Material Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => `$${row.original.price}`,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const material = row.original as Material
      const [editOpen, setEditOpen] = useState(false)
      return (
        <div className="flex gap-2">
          <EditMaterialDialog
            open={editOpen}
            onOpenChange={setEditOpen}
            material={material}
            onUpdated={onUpdated}
          />
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <DeleteDialog
            triggerText="Delete"
            onConfirm={() => onDelete(material.id)}
          />
        </div>
      )
    },
  },
]
