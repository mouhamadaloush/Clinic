"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

const schema = z.object({
  name: z.string().min(1, "The name is required."),
  description: z.string().min(1, "The description is required."),
  quantity: z.number().nonnegative("Quantity should be >= 0"),
  price: z.string().min(1, "Price is required."),
})


export default function CreateMaterialDialog({ onCreated }) {
  const { token } = useAuth()

  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", description: "", quantity: 0, price: "" },
  })

  const onSubmit = async (values) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/materials/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        throw new Error(`Create failed (${res.status})`)
      }

      toast.success("Material created successfully")
      reset()
      setOpen(false)
      if (onCreated) onCreated()
    } catch (e) {
      console.error(e)
      toast.error("صار خطأ أثناء الإضافة")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Add Material</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Material</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter material name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Enter description" {...register("description")} />
            {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              {...register("quantity", { setValueAs: (v) => (v === "" ? 0 : Number(v)) })}
            />
            {errors.quantity && <p className="text-sm text-red-600">{errors.quantity.message}</p>}
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" placeholder="Enter price" {...register("price")} />
            {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "loading..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
