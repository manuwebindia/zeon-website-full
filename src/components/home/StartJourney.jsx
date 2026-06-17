import Image from "next/image";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import dynamic from "next/dynamic";

const AdmissionForm = dynamic(() => import("../AdmissionForm"));

export default function StartJourney() {
  return (
        <section id="admission" className="bg-white py-10 md:py-14 lg:py-16 xl:py-20">
          <div className="w-full max-w-[1100px] mx-auto px-6">
            <div className="flex items-center gap-16 lg:gap-20 flex-col lg:flex-row">
              {/* Left Side: Text & Counsellor */}
              <div id="counsellor" className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-1/2 order-2 lg:order-none">
                <h2 className="text-[2.2rem] lg:text-[3rem] font-extrabold text-heading leading-[1.1] mb-5">
                  Have Questions?
                  <br />
                  <span className="text-primary">Talk to an Expert.</span>
                </h2>
                <p className="text-[1.1rem] lg:text-[1.15rem] text-body leading-relaxed max-w-[480px] mb-10 lg:mb-12 mx-auto lg:mx-0">
                  Our admissions counselors are ready to help you navigate your
                  journey in high-performance marketing education.
                </p>

                {/* Counsellor Card */}
                <div className="flex items-center bg-surface p-5 rounded-xl shadow-card mb-8 w-full max-w-[420px] gap-5 border border-border mx-auto lg:mx-0">
                  <div className="flex-[0_0_86px] w-[86px] h-[86px] rounded-full border-2 border-primary p-0.5 flex items-center justify-center">
                    <Image
                      src="/johncy-new.webp"
                      alt="Admissions Counselor Johncy John"
                      width={90}
                      height={90}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-[1.15rem] font-extrabold text-heading mb-0.5">
                      Johncy
                    </h3>
                    <p className="text-[0.9rem] text-body m-0">
                      Academy Counselor
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 w-full max-w-[420px] flex-col sm:flex-row mx-auto lg:mx-0">
                  <a
                    href="tel:+918943356405"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full font-normal text-base bg-[#0B5CFF] text-white shadow-[0_8px_20px_rgba(11,92,255,0.25)] transition-all duration-300 hover:bg-[#1059D6] hover:shadow-[0_12px_25px_rgba(11,92,255,0.35)] hover:-translate-y-0.5"
                  >
                    <FaPhoneAlt size={16} />
                    <strong>+91 8943356405</strong>
                  </a>
                  <a
                    href="https://wa.me/917558888252?text=I%20have%20a%20question%20about%20digital%20marketing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full font-normal text-base bg-[#19be55] text-white shadow-[0_8px_20px_rgba(37,211,102,0.25)] transition-all duration-300 hover:bg-[#20bd5a] hover:-translate-y-0.5 hover:shadow-[0_12px_25px_rgba(37,211,102,0.35)]"
                  >
                    <FaWhatsapp size={20} />
                    <strong>WhatsApp</strong>
                  </a>
                </div>
              </div>

              {/* Right Side: Admission Form */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end order-1 lg:order-none">
                <AdmissionForm showHeader={false} />
              </div>
            </div>
          </div>
        </section>
  );
}
