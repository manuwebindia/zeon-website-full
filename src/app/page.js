"use client";

import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";

// Import Home Components
import HeroSection from "../components/home/HeroSection";
import HeroDownBanner from "../components/home/HeroDownBanner";
import CareerQuiz from "../components/home/CareerQuiz";
import WhyChooseZeon from "../components/home/WhyChooseZeon";
import OurCourses from "../components/home/OurCourses";
import Certifications from "../components/home/Certifications";
import TestimonialsSection from "../components/home/TestimonialsSection";

const CareerLaunch = dynamic(() => import("../components/home/CareerLaunch"));
const PlacementsSection = dynamic(() => import("../components/PlacementsSection"));
const OurPartners = dynamic(() => import("../components/OurPartners"));
const DemoSection = dynamic(() => import("../components/home/DemoSection"));
const PricingSection = dynamic(() => import("../components/home/PricingSection"));
const AdmissionProcess = dynamic(() => import("../components/home/AdmissionProcess"));
const StartJourney = dynamic(() => import("../components/home/StartJourney"));
const LocationMap = dynamic(() => import("../components/home/LocationMap"));

export default function Home() {
  // Calculate next Monday's date in dd/mm/yy format
  const getNextMondayDateStr = () => {
    const today = new Date();
    const day = today.getDay();
    let daysToNextMonday = 1 - day;
    if (daysToNextMonday <= 0) {
      daysToNextMonday += 7;
    }
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysToNextMonday);

    const dd = String(nextMonday.getDate()).padStart(2, "0");
    const mm = String(nextMonday.getMonth() + 1).padStart(2, "0");
    const yy = String(nextMonday.getFullYear()).slice(-2);

    return `${dd}/${mm}/${yy}`;
  };

  const nextBatchDate = getNextMondayDateStr();

  return (
    <>
      <Navbar />
      <WhatsAppFloat />

      <main>
        <HeroSection nextBatchDate={nextBatchDate} />
        {/* <HeroDownBanner /> */}
        
        <OurCourses />
        <OurPartners />
        <PlacementsSection />
        <section id="placements">
          
        </section>


        <TestimonialsSection />
        <WhyChooseZeon />
        <Certifications />
        <CareerLaunch />
        <CareerQuiz />
        <DemoSection />
        {/* <PricingSection /> */}
        {/* <AdmissionProcess /> */}
        <StartJourney />
        <LocationMap />
      </main>

      <Footer />
    </>
  );
}
