/* eslint-disable @next/next/no-img-element */
"use client" // ✨ هذا السطر ضروري لتعريف المكون على أنه يعمل في المتصفح

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, X, ZoomIn } from "lucide-react";

// واجهة للبيانات التي سيستقبلها المكون كـ props
interface ImageData {
  id: number;
  image: string; // سلسلة base64
  mime_type: string;
}

// واجهة لتحديد الـ props الخاصة بالمكون
interface ImageGalleryProps {
  images: ImageData[];
}

export default function ImageGalleryClient({ images }: ImageGalleryProps) {
  // حالة لتتبع الصورة التي تم اختيارها للعرض في النافذة المنبثقة
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // دالة مساعدة لتحويل بيانات الصورة base64 إلى رابط يمكن استخدامه في <img>
  const formatImageUrl = (mimeType: string, base64String: string) => {
    return `data:${mimeType};base64,${base64String}`;
  };

  return (
    <>
      {/* بطاقة عرض معرض الصور */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-black flex items-center gap-2">
            <Camera className="w-6 h-6" />
            Visual Documentation
          </CardTitle>
          <p className="text-emerald-100 mt-2">
            Click any image to view it in full size
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map(image => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setSelectedImage(formatImageUrl(image.mime_type, image.image))}
                >
                  <img
                    src={formatImageUrl(image.mime_type, image.image)}
                    alt={`Documentation image ${image.id}`}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">
              No images were uploaded for this record.
            </p>
          )}
        </CardContent>
      </Card>

      {/* النافذة المنبثقة (Modal) لعرض الصورة بالحجم الكامل */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="destructive"
              size="icon"
              className="absolute -top-4 -right-4 rounded-full h-10 w-10 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-5 h-5" />
            </Button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

