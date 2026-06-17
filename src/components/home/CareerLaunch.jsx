import { FiFileText, FiTarget, FiUsers } from "react-icons/fi";
import { FaLinkedin, FaBuilding } from "react-icons/fa";

const careerCards = [
  { icon: FiFileText, title: "Resume Building", desc: "Professional resume crafted for digital marketing roles." },
  { icon: FaLinkedin, title: "LinkedIn Optimization", desc: "Profile optimization to attract recruiters." },
  { icon: FiUsers, title: "Mock Interviews", desc: "Practice with industry-style HR and technical rounds." },
  { icon: FiTarget, title: "Job Matching", desc: "Personalized job recommendations based on your skills." },
  { icon: FaBuilding, title: "Placement Support", desc: "End-to-end assistance until you land your dream job." },
  { icon: FaBuilding, title: "Portfolio Building", desc: "Build your own professional portfolio website with our guidance." },
];

export default function CareerLaunch() {
  return (
        <section className="py-10 md:py-14 lg:py-16 xl:py-20 bg-surface">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-[4.5rem] max-w-6xl mx-auto">
              <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
                Career Launch
              </span>
              <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
                <span className="text-primary">100% Placement</span> Support
              </h2>
              <p className="text-[1.15rem] text-body leading-relaxed font-medium">
                End-to-end placement guidance through our dedicated placement
                cell
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14 justify-center">
              {careerCards.map((card, i) => (
                <div
                  key={i}
                  className="bg-white border border-border rounded-xl p-10 text-center transition-all duration-300 shadow-card hover:-translate-y-1.5 hover:shadow-card-hover hover:border-primary/20 group"
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 group-hover:bg-primary">
                    <card.icon className="text-[1.8rem] text-primary transition-colors duration-300 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-heading mb-3">
                    {card.title}
                  </h3>
                  <p className="text-base text-body leading-normal">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
  );
}
