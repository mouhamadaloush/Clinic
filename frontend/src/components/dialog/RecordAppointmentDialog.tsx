/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { X } from "lucide-react"

// 💡 1. تحديث واجهة البيانات المرسلة
export interface ImagePayload {
  mime_type: string;
  encoded_data: string;
}

export interface RecordPayload {
  appointment: number;
  text_note: string;
  images: ImagePayload[]; // استخدام الواجهة الجديدة هنا
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: number;
  onSubmit: (payload: RecordPayload) => Promise<void>;
}

// 💡 2. تعديل دالة التحويل لتُرجع object بدلاً من string
const convertFilesToObject = (files: File[]): Promise<ImagePayload[]> => {
  const promises = files.map(file => {
    return new Promise<ImagePayload>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // إزالة البادئة مثل "data:image/jpeg;base64,"
        const encodedData = base64String.substring(base64String.indexOf(',') + 1);
        
        resolve({
          mime_type: file.type, // الحصول على نوع الملف
          encoded_data: encodedData,
        });
      };
      reader.onerror = error => reject(error);
    });
  });
  return Promise.all(promises);
};


export default function RecordAppointmentDialog({ open, onOpenChange, appointmentId, onSubmit }: Props) {
  const [textNote, setTextNote] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  const handleRemoveFile = (fileToRemove: File) => {
    setSelectedFiles(prevFiles => prevFiles.filter(file => file !== fileToRemove));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!textNote.trim() && selectedFiles.length === 0) {
      toast.error("Please add a note or upload an image.")
      return
    }

    setIsSubmitting(true)

    try {
      // 💡 3. استخدام الدالة الجديدة وتخزين النتيجة في متغير مناسب
      let imagePayloads: ImagePayload[] = [];
      if (selectedFiles.length > 0) {
        imagePayloads = await convertFilesToObject(selectedFiles);
      }

      await onSubmit({
        appointment: appointmentId,
        text_note: textNote.trim(),
        images: imagePayloads, // إرسال البيانات بالتنسيق الجديد
      })

      onOpenChange(false);
      setTextNote("");
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      // The error is handled by the toast.promise in the parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Record Appointment Details</DialogTitle>
            <DialogDescription>
              Add notes and images for appointment ID: {appointmentId}
            </DialogDescription>
          </DialogHeader>
          {/* JSX for form fields remains the same */}
          <div className="grid gap-4 py-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="text_note">Text Note</Label>
              <Textarea
                id="text_note"
                placeholder="Type your note here."
                value={textNote}
                onChange={(e) => setTextNote(e.target.value)}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              {selectedFiles.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveFile(file)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}