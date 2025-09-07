"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

type LogoutDialogProps = {
  children: React.ReactNode;
  onLogoutSuccess: () => void;
};

export default function LogoutDialog({ children, onLogoutSuccess }: LogoutDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logout, token } = useAuth();

  const handleLogoutConfirm = async () => {
    setLoading(true);
    try {
      if (!token) {
        toast.error("Authentication token not found. Please log in again.");
        logout();
        onLogoutSuccess();
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/logout/`,
        {},
        {
          headers: {
            "Authorization": `Token ${token}`,
          },
        }
      );
      
      toast.success("You have been logged out successfully.");

    } catch (err) {
      console.error("Logout API failed:", err);
      toast.error("Could not contact server, logging out locally.");
    } finally {
      logout();
      setOpen(false);
      setLoading(false);
      onLogoutSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out of your account?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleLogoutConfirm} disabled={loading}>
            {loading ? "Logging out..." : "Logout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}