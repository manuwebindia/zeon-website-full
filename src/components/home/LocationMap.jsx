import ScrollReveal from "../ScrollReveal";

export default function LocationMap() {
  return (
        <section id="contact-us" className="py-12 bg-surface bg-dots-pattern relative overflow-hidden">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={40}>
              <div className="text-center mb-8">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-3 tracking-[0.2em] uppercase">
                  Find Us
                </span>
                <h2 className="text-[clamp(2rem,3.5vw,2.6rem)] font-extrabold text-heading mb-3 leading-tight">
                  Our <span className="text-primary">Campus</span> Location
                </h2>
                <p className="text-[1rem] text-body max-w-[600px] mx-auto font-medium">
                  Visit us at our Kochi campus for a friendly chat, a free demo, and career counselling.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={50} delay={0.1}>
              <div className="relative rounded-[24px] overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.08)] border border-border bg-white p-3 md:p-4 group">
                <div className="relative w-full h-[350px] md:h-[450px] rounded-[18px] overflow-hidden">
                  <iframe
                    src="https://maps.google.com/maps?q=Zeon%20Academy,%20Haritha%20Road,%20Vennala,%20Kochi,%20Kerala%20682028&t=&z=16&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Zeon Academy Location Map"
                    className="w-full h-full grayscale-[15%] contrast-[110%] group-hover:grayscale-0 transition-all duration-500"
                  ></iframe>
                </div>
                
                {/* Floating Address and Get Directions Card */}
                <div className="mt-4 md:absolute md:bottom-8 md:left-8 md:max-w-[360px] bg-white rounded-2xl p-5 md:shadow-[0_10px_35px_rgba(0,0,0,0.15)] border border-border/60 z-10">
                  <h4 className="text-[1.1rem] font-bold text-heading mb-2">Zeon Academy</h4>
                  <p className="text-[0.88rem] text-body leading-relaxed mb-4 font-medium">
                    46/2709 C, Ground Floor, Haritha Rd, Vennala, Kochi, Kerala 682028
                  </p>
                  <a
                    href="https://www.google.com/maps?rlz=1C5CHFA_enIN1151IN1151&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=KaM1iwnYcgg7MQtWkCmexzQd&daddr=46/2709+C,+Ground+Floor,+Haritha+Rd,+Vennala,+Kochi,+Kerala+682028"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full rounded-full py-2.5 px-4 font-bold text-[0.85rem] bg-primary text-white hover:bg-primary-hover transition-all duration-300 shadow-[0_4px_12px_rgba(255,68,68,0.2)]"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
  );
}
