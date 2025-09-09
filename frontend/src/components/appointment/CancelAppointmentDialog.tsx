"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

type CancelAppointmentDialogProps = {
  id: number;
  trigger: React.ReactNode;
  onAppointmentCancelled: () => void;
};

export default function CancelAppointmentDialog({ id, trigger, onAppointmentCancelled }: CancelAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
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

      setOpen(false);
      onAppointmentCancelled();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {trigger}
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Appointment</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to cancel this appointment?</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>No</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? "Cancelling..." : "Yes, Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}