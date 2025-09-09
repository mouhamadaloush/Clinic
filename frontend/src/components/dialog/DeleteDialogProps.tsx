"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface DeleteDialogProps {
  onConfirm: () => void
  triggerText?: string
  title?: string
  description?: string
  triggerVariant?: "default" | "outline" | "destructive"
}

export default function DeleteDialog({
  onConfirm,
  triggerText = "Delete",
  title = "Are you sure?",
  description = "This action cannot be undone.",
  triggerVariant = "destructive",
}: DeleteDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm()  // ✅ دعم العمليات الغير متزامنة
      setOpen(false)     // ✅ يغلق الـ popup بعد النجاح
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>{triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading ? "Loading..." : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
