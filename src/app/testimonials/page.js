import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import TestimonialsClient from "./TestimonialsClient";

import { buildPageMetadata } from "@/lib/pageSeo";

export async function generateMetadata() {
  return buildPageMetadata("/testimonials");
}

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
