"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
import { materialsColumns } from "@/components/columns/materialsColumns"
import { DataTable } from "@/components/DataTable"
import CreateMaterialDialog from './../../../components/dialog/CreateMaterialDialog';

export interface Material {
  id: number
  name: string
  description: string
  quantity: number
  price: string
}

interface ApiResponse {
  count: number
  next: string | null
  previous: string | null
  results: Material[]
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [next, setNext] = useState<string | null>(null)
  const [previous, setPrevious] = useState<string | null>(null)
  const [count, setCount] = useState<number>(0)
  const [page, setPage] = useState<number>(1)

  const { token } = useAuth()

  const fetchMaterials = async (url?: string) => {
    try {
      setLoading(true)
      const response = await fetch(url ?? `${process.env.NEXT_PUBLIC_API_ENDPOINT}/materials/`, {
        headers: { Authorization: `Token ${token}` },
      })

      if (!response.ok) throw new Error("Failed to load data")

      const data: ApiResponse = await response.json()
      setMaterials(data.results)
      setNext(data.next)
      setPrevious(data.previous)
      setCount(data.count)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/materials/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      })
      if (!response.ok) throw new Error("Failed to delete material")
      toast.success("Deleted successfully")
      fetchMaterials()
    } catch {
      toast.error("Delete error")
    }
  }

  useEffect(() => {
    if (token) {
      fetchMaterials()
    }
  }, [token])

  if (error) return <div className="p-6 text-center text-red-500">{error}</div>

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="w-fit ml-auto">
            <CreateMaterialDialog onCreated={() => fetchMaterials()} />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Medical Materials</CardTitle>
          
        </CardHeader>

        <CardContent className="h-[55vh] sm:h-[65vh] flex flex-col">
          <DataTable
            data={materials}
            columns={materialsColumns({
              onDelete: handleDelete,
              onUpdated: (updatedMaterial) => {
                setMaterials((prev) =>
                  prev.map((m) => (m.id === updatedMaterial.id ? updatedMaterial : m))
                )
              },
            })}
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
                  fetchMaterials(previous)
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
                  fetchMaterials(next)
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
