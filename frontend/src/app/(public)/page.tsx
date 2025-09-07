import BannerSection from "@/components/home/BannerSection";
import MainSection from "@/components/home/MainSection";
import Specialty from "@/components/home/Specialty";
import Image from "next/image";

export default function Home() {

  return (
    <main className="outfit-font">
      <MainSection />
      <Specialty />
      <BannerSection />
    </main>
  );
}
