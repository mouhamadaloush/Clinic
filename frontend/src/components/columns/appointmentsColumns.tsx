/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, FileText, Pencil } from "lucide-react"
import DeleteDialog from "@/components/dialog/DeleteDialogProps"
import RecordAppointmentDialog, { RecordPayload } from "@/components/dialog/RecordAppointmentDialog"
import { useState } from "react"
import Link from "next/link"

export interface AppointmentWithDate {
  id: number
  user: number
  reason_of_appointment: string
  time: string
  date: string
  has_record: boolean
}

interface ColumnProps {
  onDelete: (id: number) => void
  onRecord: (payload: RecordPayload) => Promise<void>
}

export const appointmentsColumns = ({ onDelete, onRecord }: ColumnProps): ColumnDef<AppointmentWithDate>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "time",
    header: "Time",
    cell: ({ row }) => <div>{row.original.time}</div>,
  },
  {
    accessorKey: "reason_of_appointment",
    header: "Reason",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const appointment = row.original
      const [recordOpen, setRecordOpen] = useState(false)

      return (
        <div className="flex items-center gap-2">
          {appointment.has_record ? (
            <Link href={`/my-appointments/record/${appointment.id}`}>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Show Record
              </Button>
            </Link>
          ) : (
            <>
              <RecordAppointmentDialog
                open={recordOpen}
                onOpenChange={setRecordOpen}
                appointmentId={appointment.id}
                onSubmit={onRecord}
              />
              <Button className="w-[125px]" variant="outline" size="sm" onClick={() => setRecordOpen(true)}>
                <FileText className="h-4 w-4 mr-1" /> Record
              </Button>
            </>
          )}

          <DeleteDialog
            triggerText="Delete"
            onConfirm={() => onDelete(appointment.id)}
            title="Are you sure?"
            description="This action will permanently delete the appointment."
          />
        </div>
      )
    },
  },
]
