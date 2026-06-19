import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import TestimonialsClient from "./TestimonialsClient";

export const metadata = {
  title: "Student Testimonials | Zeon Academy",
  description:
    "Hear from our students about their journey at Zeon Academy — Kerala's #1 digital marketing institute. Real stories, real career transformations.",
  alternates: {
    canonical: "/testimonials",
  },
};

export default function TestimonialsPage() {
  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <TestimonialsClient />
      <Footer />
    </>
  );
}
