import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FaStar, FaCheckCircle, FaShareAlt, FaGift } from "react-icons/fa";
import Navbar from "../../../components/Navbar";
import FAQAccordion from "../../../components/FAQAccordion";
import CourseCard from "../../../components/CourseCard";
import ScrollReveal from "../../../components/ScrollReveal";
import FreeDemoForm from "../../../components/FreeDemoForm";
import CourseTestimonials from "../../../components/CourseTestimonials";
import Footer from "../../../components/Footer";

const WhatsAppFloat = dynamic(() => import("../../../components/WhatsAppFloat"));
const BookDemoModal = dynamic(() => import("../../../components/BookDemoModal"));
const LegalModal = dynamic(() => import("../../../components/LegalModal"));

export const metadata = {
  title: "Advanced Digital Marketing Course in Kochi | Zeon Academy",
  description: "Join our Advanced Digital Marketing Course to learn SEO, Social Media Marketing, Google Ads, and WordPress. Complete with an internship and placement assistance.",
  alternates: {
    canonical: "/courses/advanced-digital-marketing",
  },
};

export default function AdvancedDigitalMarketingPage() {
  const whatYouWillLearn = [
    "Build a Digital Marketing Strategy",
    "Optimize Websites for SEO",
    "Drive Organic Traffic with SEO",
    "Create a Content Strategy Plan",
    "Find Your Online Audience",
    "Drive Traffic with the targeted audience",
    "Create effective Google Ads",
    "Create effective social media Ads",
    "Analyze Website Data",
  ];

  const courseContent = [
    { question: "Introduction to Digital Marketing", answer: "Learn the fundamentals of digital marketing, its channels, and how it differs from traditional marketing." },
    { question: "Market Research", answer: "Learn to conduct effective market research, understand your target audience, their needs, preferences, and behavior to inform business decisions." },
    { question: "Website Fundamentals", answer: "Understand how domains, hosting, and website structures work to create a solid foundation for digital marketing." },
    { question: "WordPress", answer: "Learn to build and manage a fully functional website or blog using WordPress without any coding knowledge." },
    { question: "Search Engine Optimization", answer: "Master on-page, off-page, and technical SEO strategies to rank websites higher on Google search results." },
    { question: "Search Engine Marketing Using Google Ads", answer: "Create and optimize paid search campaigns using Google Ads to drive targeted traffic to your website." },
    { question: "Google Analytics & Google Search Console", answer: "Track and analyze website traffic, user behavior, and performance metrics using Google's powerful tools." },
    { question: "Social Media Marketing", answer: "Build brand awareness and engage with audiences on platforms like Facebook, Instagram, LinkedIn, and Twitter." },
    { question: "PPC Advertising", answer: "Learn the principles of Pay-Per-Click advertising to maximize ROI on various ad networks." },
    { question: "Copy Writing", answer: "Write compelling and persuasive ad copies, landing page content, and social media posts that convert." },
    { question: "Content Marketing", answer: "Create and distribute valuable content to attract, engage, and retain a clearly defined audience." },
    { question: "Email Marketing", answer: "Design effective email campaigns, build subscriber lists, and use automation to nurture leads." },
    { question: "Youtube Marketing", answer: "Optimize YouTube channels and videos to increase views, subscribers, and brand visibility." },
    { question: "Marketing Automation & Affiliate Marketing", answer: "Automate repetitive marketing tasks and learn how to earn commissions by promoting other people's products." },
    { question: "Design Techniques for Social Media", answer: "Use tools like Canva to create visually appealing graphics for your digital marketing campaigns." }
  ];

  return (
    <>
      <Navbar />
      <LegalModal />
      <WhatsAppFloat />
      <BookDemoModal />

      <main className="bg-surface pt-24 pb-20">
        {/* HEADER HERO */}
        <section className="bg-white border-b border-border py-12 lg:py-16">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
              <div className="flex-1 animate-fade-in-up">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-[0.88rem] font-semibold text-body mb-6">
                  <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                  <span className="text-border">/</span>
                  <Link href="/courses" className="hover:text-primary transition-colors">Courses</Link>
                  <span className="text-border">/</span>
                  <span className="text-primary font-bold">Advanced Digital Marketing Course</span>
                </div>

                <h1 className="text-[2.2rem] md:text-[3rem] font-extrabold text-heading leading-tight mb-4">
                  Advanced Digital Marketing Course
                </h1>
                <p className="text-[1.1rem] md:text-[1.2rem] text-body font-medium leading-relaxed mb-6">
                  Social Media Marketing | Google & FB Ads | WordPress | SEO | Analytics & More
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 bg-[#fff8e1] px-4 py-2 rounded-full border border-[#ffe082]">
                    <span className="font-extrabold text-heading">5.0</span>
                    <div className="flex text-gold text-sm">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                    </div>
                  </div>
                  <span className="text-body font-medium text-[0.95rem]">Google Reviews</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT AREA */}
        <section className="py-12 md:py-16 relative">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-10">
              
              {/* LEFT COLUMN - CONTENT */}
              <div className="flex-1 lg:w-2/3">
                
                {/* Course Video */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="mb-10">
                    <div className="relative w-full aspect-video rounded-[20px] overflow-hidden shadow-card border border-border">
                      <iframe 
                        className="absolute top-0 left-0 w-full h-full"
                        src="https://www.youtube.com/embed/ejHyZIHXNP0" 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                      </iframe>
                    </div>
                  </div>
                </ScrollReveal>

                {/* Description */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="mb-10">
                    <h2 className="text-[1.5rem] font-extrabold text-heading mb-4">Description</h2>
                    <div className="text-[1.05rem] text-body leading-relaxed space-y-4 font-medium">
                      <p>
                        This course is designed to create a firm understanding of several aspects of the Digital Marketing industry. Completing this course will give you a clear understanding of the foundations of the new digital marketing landscape. The modules will equip you with the tools, concepts, and stories that help you create, and promote digital products and services online. We have structured the course in a strictly job-oriented format. This course contains theoretical classes, in-hand projects, and an internship in our parent Digital marketing company.
                      </p>
                      <p>
                        The course is taught by working professionals of Web India Branding and Marketing. The modules are easy to digest and delivered in a conversational style. Communication in the classroom will be in Malayalam. The course will be available only in online mode.
                      </p>
                    </div>
                  </div>
                </ScrollReveal>

                {/* What you'll learn */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="bg-white border border-border rounded-[20px] p-6 md:p-8 mb-8 shadow-sm">
                    <h2 className="text-[1.5rem] font-extrabold text-heading mb-6">What you'll learn</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                      {whatYouWillLearn.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <FaCheckCircle className="text-primary mt-1 shrink-0" />
                          <span className="text-body font-medium leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>

                {/* Course Content */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="mb-10">
                    <h2 className="text-[1.8rem] font-extrabold text-heading mb-6">Course Content</h2>
                    <FAQAccordion faqs={courseContent} />
                  </div>
                </ScrollReveal>

                {/* Requirements */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="mb-10">
                    <h2 className="text-[1.5rem] font-extrabold text-heading mb-4">Requirements</h2>
                    <ul className="list-disc pl-5 space-y-2 text-body font-medium">
                      <li>A desire to learn</li>
                      <li>No prior knowledge required</li>
                    </ul>
                  </div>
                </ScrollReveal>

                {/* Testimonials */}
                <ScrollReveal direction="up" distance={30}>
                  <div className="mb-12">
                    <h2 className="text-[1.8rem] font-extrabold text-heading mb-6">Student Reviews</h2>
                    <CourseTestimonials />
                  </div>
                </ScrollReveal>

              </div>

              {/* RIGHT COLUMN - SIDEBAR */}
              <div className="w-full lg:w-1/3 lg:max-w-[400px]">
                <div className="h-full space-y-8">
                  
                  {/* Course Features Card */}
                  <div className="bg-white border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all">
                    <h3 className="font-extrabold text-[1.25rem] text-heading mb-5">This course includes:</h3>
                    <ul className="space-y-4 mb-6">
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-primary text-sm" />
                        </div>
                        2 months classes
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-primary text-sm" />
                        </div>
                        3 months internship
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-primary text-sm" />
                        </div>
                        100% placement assistance
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-primary text-sm" />
                        </div>
                        Certificate of completion
                      </li>
                      <li className="flex items-center gap-3 text-body font-medium">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <FaCheckCircle className="text-primary text-sm" />
                        </div>
                        1 Year Academic Support
                      </li>
                    </ul>

                    <div className="flex gap-4 pt-4 border-t border-border/60">
                      <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-surface border border-border hover:bg-body/5 hover:border-body/20 transition-all text-heading">
                        <FaShareAlt className="text-primary" /> Refer a Friend
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-surface border border-border hover:bg-body/5 hover:border-body/20 transition-all text-heading">
                        <FaGift className="text-primary" /> Gift Course
                      </button>
                    </div>
                  </div>

                  {/* Demo Form */}
                  <div className="sticky top-28">
                    <FreeDemoForm />
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* MORE COURSES SECTION */}
        <section className="py-16 bg-white border-t border-border">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <h2 className="text-[2rem] font-extrabold text-heading mb-10 text-center">More Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CourseCard
                mode="online"
                title="SEO Specialist Course"
                duration="15 Days + 1 Month Internship"
                image="/courses/seo-course.webp"
                slug="/courses/seo-specialist"
                certifications="Zeon & Google Certifications"
                placement="1-Month Agency Internship Support"
                description="A fast-track SEO program designed to build strong search optimization skills in just 15 days."
                learnList={[
                  "SEO Search Logic & Search Algorithms",
                  "On-Page Content SEO & Page Speeds",
                  "Technical SEO Auditing & Screaming Frog"
                ]}
                isPopular={false}
              />
              <CourseCard
                mode="online"
                title="Social Media Management"
                duration="1 Month"
                image="/courses/digitalmarketing-course.webp"
                slug="/courses/social-media-management"
                certifications="Meta Certifications"
                placement="Placement Drive Eligibility"
                description="Master social media strategies to grow organic audience and brand presence online."
                learnList={[
                  "Social Media Branding",
                  "Content Calendar Creation",
                  "Organic Growth Hacks"
                ]}
                isPopular={false}
              />
              <CourseCard
                mode="online"
                title="Ads Specialist Course"
                duration="10 Days"
                image="/courses/ads-course.webp"
                slug="/courses/ads-specialist"
                certifications="Google & Meta Ads Certifications"
                placement="Placement Drive Eligibility"
                description="A 10-day intensive training focused on creating, managing, and optimizing high-performance ad campaigns."
                learnList={[
                  "Paid Advertising Foundations",
                  "Google Search & Display Network Ads",
                  "Meta Business Suite & Pixel Tracking"
                ]}
                isPopular={false}
              />
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}
