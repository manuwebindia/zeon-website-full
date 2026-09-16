import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import WhatsAppFloat from "../../components/WhatsAppFloat";
import TestimonialsClient from "./TestimonialsClient";

import { buildPageMetadata, getPageCms } from "@/lib/pageSeo";

export async function generateMetadata() {
  return buildPageMetadata("/testimonials");
}

export default async function TestimonialsPage() {
  const cms = await getPageCms("/testimonials");

  return (
    <>
      <Navbar />
      <WhatsAppFloat />
      <TestimonialsClient bannerImage={cms?.bannerImage} />
      <Footer />
    </>
  );
}
