"use client";

import dynamic from "next/dynamic";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LegalModal from "../components/LegalModal";
import WhatsAppFloat from "../components/WhatsAppFloat";

// Import Home Components
import HeroSection from "../components/home/HeroSection";
import HeroDownBanner from "../components/home/HeroDownBanner";
import CareerQuiz from "../components/home/CareerQuiz";
import WhyChooseZeon from "../components/home/WhyChooseZeon";
import OurCourses from "../components/home/OurCourses";
import Certifications from "../components/home/Certifications";

const CareerLaunch = dynamic(() => import("../components/home/CareerLaunch"));
const PlacementsSection = dynamic(() => import("../components/PlacementsSection"));
const OurPartners = dynamic(() => import("../components/OurPartners"));
const TestimonialsSlider = dynamic(() => import("../components/TestimonialsSlider"));
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
      <LegalModal />
      <WhatsAppFloat />

      <main>
        <HeroSection nextBatchDate={nextBatchDate} />
        <HeroDownBanner />
        <CareerQuiz />
        <WhyChooseZeon />
        <OurCourses />
        <Certifications />
        <CareerLaunch />
        
        <section id="placements">
          <PlacementsSection />
        </section>

        <OurPartners />

        <section id="testimonials" className="py-10 md:py-14 lg:py-16 xl:py-20 bg-white">
          <div className="w-full max-w-[1200px] mx-auto px-6 text-center">
            <div className="text-center mb-[4.5rem] max-w-6xl mx-auto">
              <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
                Reviews
              </span>
              <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
                What Our Students Say About{" "}
                <span className="text-primary">Zeon Academy</span>
              </h2>
              <p className="text-[1.15rem] text-body leading-relaxed font-medium">
                Real experiences from students who completed the Digital
                Marketing Career Program.
              </p>
            </div>

            <TestimonialsSlider />
          </div>
        </section>

        <DemoSection />
        <PricingSection />
        <AdmissionProcess />
        <StartJourney />
        <LocationMap />
      </main>

      <Footer />
    </>
  );
}
