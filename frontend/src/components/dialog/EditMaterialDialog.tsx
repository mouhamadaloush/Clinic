"use client"

import { useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
export interface Material {
  id: number
  name: string
  description: string
  quantity: number
  price: string
}

const schema = z.object({
  name: z.string().min(1, "The name is required."),
  description: z.string().min(1, "The description is required."),
  quantity: z.number().nonnegative("Quantity should be bigger or equal to 0."),
  price: z.string().min(1, "Price is required."),
})

type FormValues = z.infer<typeof schema>

interface EditMaterialDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  material: Material | null
  onUpdated?: (updatedMaterial: Material) => void
}

export default function EditMaterialDialog({
  open,
  onOpenChange,
  material,
  onUpdated,
}: EditMaterialDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const { token } = useAuth()

  useEffect(() => {
    if (material) {
      reset({
        name: material.name,
        description: material.description,
        quantity: material.quantity,
        price: material.price,
      })
    }
  }, [material, reset])

  const onSubmit = async (values: FormValues) => {
    if (!material) return
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/materials/${material.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(values),
        }
      )

      if (!res.ok) {
        throw new Error(`Update failed (${res.status})`)
      }

      const updated: Material = await res.json()
      toast.success("Material updated successfully")
      onOpenChange(false)
      if (onUpdated) onUpdated(updated)
    } catch (e) {
      toast.error("An error occurred while updating.")
      console.log(e)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Material</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter material name" {...register("name")} className="mt-1" />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter description"
              {...register("description")}
              className="mt-1"
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              {...register("quantity", {
                setValueAs: (v: any) => (v === "" || v === null ? 0 : Number(v)),
              })}
              className="mt-1"
              placeholder="Enter the quantity"
            />
            {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>}
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" placeholder="Enter price" {...register("price")} className="mt-1" />
            {errors.price && <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>}
          </div>

          <DialogFooter className="gap-2 sm:justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}