"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import DeleteDialog from "@/components/dialog/DeleteDialogProps"

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string
  dob: string
  gender: string
  is_active: boolean
  is_staff: boolean
}

interface ColumnProps {
  onDelete: (id: number) => void
}

export const usersColumns = ({ onDelete }: ColumnProps): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "is_active",
    header: "Active",
    cell: ({ row }) => (row.original.is_active ? "Yes" : "No"),
  },
  {
    accessorKey: "is_staff",
    header: "Doctor",
    cell: ({ row }) => (row.original.is_staff ? "Yes" : "No"),
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) => {
  //     const user = row.original
  //     return (
  //       <div className="flex gap-2">
  //         <DeleteDialog
  //           triggerText="Delete"
  //           onConfirm={() => onDelete(user.id)}
  //         />
  //       </div>
  //     )
  //   },
  // },
]
