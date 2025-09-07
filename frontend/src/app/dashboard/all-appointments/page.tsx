"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
import { DataTable } from "@/components/DataTable"
import { RecordPayload } from "@/components/dialog/RecordAppointmentDialog"
import { appointmentsColumns } from "@/components/columns/appointmentsColumns"
import axios from "axios"

export interface Appointment {
  id: number
  user: number
  chosen_date: string
  reason_of_appointment: string
  has_record: boolean
}

export interface FormattedAppointment extends Appointment {
  date: string;
  time: string;
}

type ApiResponse = Appointment[]

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<ApiResponse>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/appointment/list_all_appointments/`, {
        headers: { Authorization: `Token ${token}` },
      })
      if (!response.ok) throw new Error("Failed to load appointments")
      const data: ApiResponse = await response.json()
      setAppointments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const formattedAppointments = useMemo((): FormattedAppointment[] => {
    return appointments.map(appointment => {
      const dateObj = new Date(appointment.chosen_date);
      const date = dateObj.toISOString().split('T')[0];
      const time = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

      return {
        ...appointment,
        date,
        time,
      }
    })
  }, [appointments])
  
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication token not found");
        return;
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/appointment/delete/?id=${id}`,
        {
          headers: {
            "Authorization": `Token ${token}`,
          },
        }
      );

      toast.success(response?.data?.message || "The Appointment has been deleted");
      fetchAppointments()
    } catch {
      toast.error("Failed to delete appointment")
    }
  }

  const handleRecord = async (payload: RecordPayload) => {
    const promise = fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/appointment/record/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    });

    await toast.promise(
      promise.then(async (res) => {
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ detail: "An unknown error occurred." }));
            throw new Error(errorData.detail || "Failed to record appointment");
        }
        // fetchAppointments(); 
        return res.json();
      }),
      {
        loading: 'Recording appointment...',
        success: 'Appointment recorded successfully!',
        error: (err) => err.message || 'Failed to record appointment',
      }
    );
  }

  useEffect(() => {
    if (token) {
      fetchAppointments()
    }
  }, [token])

  if (error) return <div className="p-6 text-center text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Appointments</CardTitle>
        </CardHeader>

        <CardContent className="h-[55vh] sm:h-[71vh] flex flex-col">
          <DataTable
            data={formattedAppointments}
            columns={appointmentsColumns({
              onDelete: handleDelete,
              onRecord: handleRecord,
            })}
            loading={loading}
          />
        </CardContent>

        <CardFooter className="flex justify-end items-center">
            <span>
                Total Appointments: {formattedAppointments.length}
            </span>
        </CardFooter>
      </Card>
    </div>
  )
}