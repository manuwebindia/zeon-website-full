import dynamic from "next/dynamic";

const PricingTabs = dynamic(() => import("../PricingTabs"));

export default function PricingSection() {
  return (
        <section id="fees" className="py-10 md:py-14 lg:py-16 xl:py-20 bg-white">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-[4.5rem] max-w-6xl mx-auto">
              <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
                Payment Structure
              </span>
              <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
                Simple & Flexible{" "}
                <span className="text-primary">Fee Plans & Schedule</span>
              </h2>
              <p className="text-[1.15rem] text-body leading-relaxed font-medium">
                Choose the payment plan that works best for you one-time payment or convenient installment options starting from just ₹5,000.
              </p>
            </div>

            {/* Pricing Grid */}
            <PricingTabs />

            {/* Trust Strip */}
            {/* <div className="mt-12 bg-white border border-border rounded-2xl p-8 flex items-start gap-8 flex-wrap">
              <div className="flex items-start gap-4 flex-1 min-w-[220px]">
                <FaShieldAlt className="text-[2.5rem] text-[#0B5CFF] shrink-0 mt-0.5" />
                <div>
                  <p className="text-base font-extrabold text-heading mb-1.5">
                    Secure Payment Gateway
                  </p>
                  <p className="text-[0.85rem] text-body leading-normal">
                    All payments processed through Razorpay with complete
                    encryption, OTP verification, and fraud protection.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1 min-w-[280px]">
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface border border-border rounded-full text-[0.82rem] font-semibold text-heading">
                    <FaMobileAlt /> UPI
                  </span>
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface border border-border rounded-full text-[0.82rem] font-semibold text-heading">
                    <FaCreditCard /> Credit Card
                  </span>
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface border border-border rounded-full text-[0.82rem] font-semibold text-heading">
                    <FaCreditCard /> Debit Card
                  </span>
                  <span className="flex items-center gap-1.5 px-3.5 py-1.5 bg-surface border border-border rounded-full text-[0.82rem] font-semibold text-heading">
                    <FaUniversity /> Net Banking
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-[0.8rem] font-bold text-green bg-green/8 px-3.5 py-1.5 rounded-full">
                    <FaLock /> Secure Payment
                  </span>
                  <span className="flex items-center gap-1.5 text-[0.8rem] font-bold text-green bg-green/8 px-3.5 py-1.5 rounded-full">
                    <FaShieldAlt /> ISO Certified
                  </span>
                  <span className="flex items-center gap-1.5 text-[0.8rem] font-bold text-green bg-green/8 px-3.5 py-1.5 rounded-full">
                    <FaCheckCircle /> 100% Placement Support
                  </span>
                </div>
              </div>
            </div> */}

            <p className="text-center mt-12 text-[0.95rem] text-body">
              Have questions before paying?{" "}
              <a href="#counsellor" className="text-primary font-bold">
                Talk to our counsellor
              </a>
            </p>
          </div>
        </section>
  );
}
