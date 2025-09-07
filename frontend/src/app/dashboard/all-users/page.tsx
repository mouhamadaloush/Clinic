"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
import { DataTable } from "@/components/DataTable"
import { usersColumns } from "@/components/columns/usersColumns"

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

interface ApiResponse {
  count: number
  next: string | null
  previous: string | null
  data: User[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [next, setNext] = useState<string | null>(null)
  const [previous, setPrevious] = useState<string | null>(null)
  const [count, setCount] = useState<number>(0)
  const [page, setPage] = useState<number>(1)

  const { token } = useAuth()

  const fetchUsers = async (url?: string) => {
    try {
      setLoading(true)
      const response = await fetch(url ?? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/`, {
        headers: { Authorization: `Token ${token}` },
      })
      if (!response.ok) throw new Error("Failed to load data")

        
      const data: User[] = await response.json()
      setUsers(data)
      setNext(null)
      setPrevious(null)
      setCount(data.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      })
      if (!response.ok) throw new Error("Failed to delete user")
      toast.success("Deleted successfully")
      fetchUsers()
    } catch {
      toast.error("Delete error")
    }
  }

  useEffect(() => {
    if (token) fetchUsers()
  }, [token])

  if (error) return <div className="p-6 text-center text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Users</CardTitle>
        </CardHeader>

        <CardContent className="h-[61.4vh] sm:h-[69.5vh] flex flex-col">
          <DataTable
            data={users}
            columns={usersColumns({ onDelete: handleDelete })}
            loading={loading}
          />
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center justify-start gap-3">
            <span>
              <span className="font-medium">Page</span> {page} of {Math.ceil(count / 10)}
            </span>
            <span>
              <span className="font-medium">Count:</span> {count}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={!previous}
              onClick={() => {
                if (previous) {
                  fetchUsers(previous)
                  setPage((p) => p - 1)
                }
              }}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={!next}
              onClick={() => {
                if (next) {
                  fetchUsers(next)
                  setPage((p) => p + 1)
                }
              }}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
