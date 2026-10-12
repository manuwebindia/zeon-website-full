import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import TestimonialsClient from "./TestimonialsClient";

import { buildPageMetadata, getPageCms } from "@/lib/pageSeo";

export async function generateMetadata() {
  return buildPageMetadata("/testimonial");
}

export default async function TestimonialsPage() {
  const cms = await getPageCms("/testimonial");

  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <TestimonialsClient bannerImage={cms?.bannerImage} />
      <Footer />
    </>
  );
}
