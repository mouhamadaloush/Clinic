/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Camera, X, ZoomIn, Loader2, Info, Bot } from "lucide-react" // 1. Import Bot icon

interface ImageData {
  id: number;
  image: string;
  mime_type: string;
  gemini_analysis: string;
  record: number;
}

interface AppointmentData {
  record: {
    appointment: number;
    text_note: string;
  } | null;
  images: ImageData[];
}

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center h-96">
    <Loader2 className="w-12 h-12 animate-spin text-emerald-600" />
    <p className="mt-4 text-slate-600">Loading appointment data...</p>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center h-96 bg-red-50 p-6 rounded-lg border border-red-200">
    <X className="w-12 h-12 text-red-500" />
    <p className="mt-4 text-red-700 font-semibold text-lg">An Error Occurred</p>
    <p className="text-red-600">{message}</p>
  </div>
);

  const NoRecordMessage = () => (
    <div className="flex flex-col items-center justify-center h-96 bg-sky-50 p-8 rounded-lg border border-sky-200 text-center shadow-sm">
        <Info className="w-12 h-12 text-sky-500" />
        <p className="mt-4 text-sky-800 font-semibold text-xl">No Record Available Yet</p>
        <p className="text-sky-700 mt-2 max-w-md">The doctor has not yet added a clinical record or notes for this appointment. Please check back later for updates.</p>
    </div>
  );

export default function DentalAppointmentRecord() {
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const params = useParams()
  const appointmentId = params.id as string

  const { token } = useAuth();

  const router = useRouter();

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("authToken")
    if (!tokenFromStorage) {
      router.push("/login")
    }
  },[router])

  useEffect(() => {
    if (!appointmentId) {
      setError("Appointment ID not found in the URL.")
      setIsLoading(false)
      return
    }

    if (!token) {
      return;
    }

    const fetchAppointmentData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `https://clinic-ashen.vercel.app/appointment/get_record/?appointment_id=${appointmentId}`,
          {
            headers: {
              'Authorization': `Token ${token}`,
            }
          }
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch data. Status code: ${response.status}`)
        }

        const data = await response.json()
        setAppointmentData(data)
      } catch (err: any) {
        console.error("API Fetch Error:", err)
        setError(err.message || "An unexpected error occurred while connecting to the server.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointmentData()
  }, [appointmentId, token])

  const createImageUrl = (base64String: string, mimeType: string) => {
    return `data:${mimeType};base64,${base64String}`;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="ltr">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1
            className="text-2xl md:text-5xl font-black text-mainColor mb-2"
            style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
          >
            Dental Appointment Record
          </h1>
          <p className="text-md md:text-lg text-slate-600" style={{ fontFamily: "var(--font-open-sans), sans-serif" }}>
            Comprehensive details of your visit
          </p>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : appointmentData ? (
          appointmentData.record === null ? (
            <NoRecordMessage />
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader className="bg-mainColor text-white rounded-t-lg">
                    <CardTitle className="text-lg md:text-xl font-black flex items-center gap-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                      <FileText className="w-5 h-5 md:w-6 md:h-6" />
                      Doctor's Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-slate-700 leading-relaxed" style={{ fontFamily: "var(--font-open-sans), sans-serif" }}>
                      <span className="font-medium">Note:</span> {appointmentData.record.text_note || "No notes provided."}
                    </p>
                  </CardContent>
                </Card>

                {appointmentData.images && appointmentData.images.length > 0 && (
                  <Card className="shadow-lg border-0 bg-white">
                    <CardHeader className="bg-indigo-600 text-white rounded-t-lg">
                      <CardTitle className="text-lg md:text-xl font-black flex items-center gap-2" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                        <Bot className="w-5 h-5 md:w-6 md:h-6" />
                        AI Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      {appointmentData.images.map((image) => (
                        <div key={image.id} className="flex gap-4 p-3 bg-slate-50 rounded-lg items-start border">
                          <img
                            src={createImageUrl(image.image, image.mime_type)}
                            alt={`Thumbnail for analysis ${image.id}`}
                            className="w-20 h-20 object-cover rounded-md border-2 border-white shadow-sm shrink-0"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-slate-600 leading-relaxed" style={{ fontFamily: "var(--font-open-sans), sans-serif" }}>
                              {image.gemini_analysis}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
                {/* End of the new AI Analysis section */}

              </div>

              <div>
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader className="bg-mainColor text-white rounded-t-lg">
                    <CardTitle
                      className="text-lg md:text-xl font-black flex items-center gap-2"
                      style={{ fontFamily: "var(--font-montserrat), sans-serif" }}
                    >
                      <Camera className="w-5 h-5 md:w-6 md:h-6" />
                      Visual Documentation
                    </CardTitle>
                    {appointmentData.images && appointmentData.images.length > 0 && (
                        <p className="text-emerald-100 mt-2" style={{ fontFamily: "var(--font-open-sans), sans-serif" }}>
                            Click any image to view it in full size
                        </p>
                    )}
                  </CardHeader>
                  <CardContent className="p-6">
                    {appointmentData.images && appointmentData.images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {appointmentData.images.map((image) => (
                          <div
                            key={image.id}
                            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            onClick={() => setSelectedImage(createImageUrl(image.image, image.mime_type))}
                          >
                            <img
                              src={createImageUrl(image.image, image.mime_type)}
                              alt={`Documentation Image ${image.id}`}
                              className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                              <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                        <p className="text-center text-slate-500 py-8">No images available for this appointment.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        ) : null}

        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="outline"
                size="icon"
                className="absolute -top-12 right-0 bg-white hover:bg-gray-100"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
              <img
                src={selectedImage}
                alt="Enlarged Image"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}