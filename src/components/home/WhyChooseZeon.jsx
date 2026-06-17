import { FaGraduationCap } from "react-icons/fa";
import { FiMonitor, FiBriefcase, FiUsers, FiFolder, FiDollarSign, FiAward, FiUserCheck } from "react-icons/fi";

const features = [
  { icon: FaGraduationCap, title: "7+ Years of Experience", desc: "Years of excellence in digital marketing education with proven curriculum" },
  { icon: FiMonitor, title: "100% Practical Training", desc: "Hands-on learning with live tools like Google Ads, Meta Ads, Analytics" },
  { icon: FiBriefcase, title: "Guaranteed Internship", desc: "Every student gets real company internship experience" },
  { icon: FiUsers, title: "Dedicated Placement Cell", desc: "Personal placement assistance with 100+ hiring partners" },
  { icon: FiFolder, title: "Portfolio Building", desc: "Build a job-ready portfolio with real client projects" },
  { icon: FiDollarSign, title: "Transparent Fees", desc: "No hidden charges. Easy installment options available" },
  { icon: FiAward, title: "Industry Certifications", desc: "Get certified by Google, Meta, HubSpot and more" },
  { icon: FiUserCheck, title: "Personal Mentorship", desc: "1-on-1 guidance from industry expert mentors" },
];

export default function WhyChooseZeon() {
  return (
        <section id="why-zeon" className="py-10 md:py-14 lg:py-16 xl:py-20 bg-white bg-dots-pattern">
          <div className="w-full max-w-[1200px] mx-auto px-6">
              {/* Section Header */}
              <div className="text-center mb-[4.5rem] max-w-6xl mx-auto relative">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
                  Why Students Trust Us
                </span>
                <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
                  Why Choose <span className="text-primary">Zeon</span>{" "}
                  <span className="text-heading">Academy</span>?
                </h2>
                <p className="text-[1.15rem] text-body leading-relaxed font-medium">
                  Built to help students launch their careers with real skills,
                  practical knowledge,
                  <br className="hidden sm:block" /> and strong placement
                  assistance.
                </p>
              </div>


            {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f, i) => (
                  <div
                    key={i}
                    className="bg-white border border-border rounded-2xl p-7 transition-all duration-500 shadow-[0_4px_20px_rgba(0,0,0,0.015)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,68,68,0.08)] hover:border-primary/30 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-primary to-[#ff8c4a] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute -inset-[100px] bg-primary/5 rounded-full blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
                    <div className="w-[50px] h-[50px] bg-primary-light rounded-xl flex items-center justify-center mb-5 text-primary text-[1.4rem] border border-primary/10 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:shadow-[0_8px_20px_rgba(255,68,68,0.3)] relative z-10">
                      <f.icon />
                    </div>
                    <h3 className="text-[1.05rem] font-bold text-heading mb-3">
                      {f.title}
                    </h3>
                    <p className="text-[0.95rem] leading-relaxed text-body font-medium">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
          </div>
        </section>
  );
}
