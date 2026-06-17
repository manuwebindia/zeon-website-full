import Image from "next/image";
import { FaVideo } from "react-icons/fa";
import { FiClock, FiUsers } from "react-icons/fi";
import { SiGooglemeet } from "react-icons/si";
import dynamic from "next/dynamic";

const BookDemoModal = dynamic(() => import("../BookDemoModal"));

export default function DemoSection() {
  return (
        <section id="demo" className="py-10 md:py-14 lg:py-16 xl:py-20 bg-surface">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-[4.5rem] max-w-6xl mx-auto">
              <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
                Try Before You Commit
              </span>
              <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
                Experience Zeon Academy{" "}
                <span className="text-primary">Before You Enroll</span>
              </h2>
              <p className="text-[1.15rem] text-body leading-relaxed font-medium">
                Join our weekly free live demo sessions to understand our
                training approach.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 mt-16 max-w-[1000px] mx-auto">
              {/* Live Demo Image */}
              <div className="relative  ">
                <Image
                  src="/live-demo.webp"
                  alt="Live Demo Experience"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <span className="text-white font-bold text-lg">Interactive Learning Experience</span>
                </div> */}
              </div>

              {/* Live Demo Card (Recommended) */}
              <div className="bg-white rounded-2xl p-10 md:p-12 text-left border-2 border-[#0B5CFF] shadow-[0_10px_30px_rgba(11,92,255,0.1)] transition-all duration-300 relative flex flex-col hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(11,92,255,0.15)]">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0B5CFF] text-white px-5 py-1.5 rounded-full text-[0.85rem] font-extrabold tracking-wider uppercase z-10">
                  Recommended
                </div>
                <div className="flex gap-3 mb-6">
                  <div className="bg-[#0B5CFF]/10 w-14 h-14 rounded-full flex items-center justify-center shadow-sm">
                    <div className="flex items-center justify-center w-[24px] h-[24px] bg-[#0B5CFF] rounded-[6px] shadow-sm">
                      <FaVideo className="text-white text-[11px] inherit-text ml-px" fill="currentColor" />
                    </div>
                  </div>
                  <div className="bg-[#00832D]/10 w-14 h-14 rounded-full flex items-center justify-center shadow-sm">
                    <SiGooglemeet className="text-[1.6rem] text-[#00832D]" />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-heading mb-1">
                  Free Live Demo Class
                </h3>
                <h4 className="text-[1.05rem] font-semibold text-body mb-5">
                  Join Our Weekly Free Live Demo Class
                </h4>
                <p className="text-[0.95rem] text-body leading-relaxed mb-8 flex-1">
                  Meet our trainers, ask your questions live, and understand the
                  full training flow with real interactions.
                </p>
                <ul className="list-none p-0 m-0 mb-8">
                  <li className="flex items-center gap-2.5 mb-3 text-[0.95rem] text-heading font-medium">
                    <FiClock className="text-[#0B5CFF] text-lg" /> Flexible Free Live Demo Scheduling
                  </li>
                  <li className="flex items-center gap-2.5 mb-3 text-[0.95rem] text-heading font-medium">
                    <FiUsers className="text-[#0B5CFF] text-lg" /> Interactive
                    Q &amp; A with trainers
                  </li>
                </ul>
                <BookDemoModal />
              </div>
            </div>
          </div>
        </section>
  );
}
