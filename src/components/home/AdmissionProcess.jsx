import dynamic from "next/dynamic";

const AdmissionTimeline = dynamic(() => import("../AdmissionTimeline"));

export default function AdmissionProcess() {
  return (
        <section className="admission-bg py-10 md:py-14 lg:py-16 xl:py-20 bg-surface relative overflow-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6 relative z-[1]">
            <div className="dot-grid-decor text-center mb-[4.5rem] max-w-6xl mx-auto relative">
              <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
                Admissions
              </span>
              <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
                Complete Online{" "}
                <span className="text-primary">Admission Process</span>
              </h2>
              <p className="text-[1.15rem] text-body leading-relaxed font-medium">
                Fully digital admission with no compulsory phone interaction.
                <br />Simple, transparent, and quick.
              </p>
            </div>

            <AdmissionTimeline />
          </div>
        </section>
  );
}
