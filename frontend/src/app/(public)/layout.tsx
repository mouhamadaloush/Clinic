// app/(public)/layout.tsx
import React from "react";
import Navbar from "@/components/bars/Navbar";
import Footer from "@/components/bars/Footer";

export const metadata = {
  title: "Clinic Website",
  description: "this is project for teeth",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="mx-4 sm:mx-[10%]">
        {children}
      </div>
      <Footer />
    </>
  );
}
