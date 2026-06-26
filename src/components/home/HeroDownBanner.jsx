import Image from "next/image";

export default function HeroDownBanner() {
  return (
        <section className="w-full bg-white pt-3 pb-4 md:pt-3 md:pb-5 lg:pb-1">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <div className="relative w-full rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] group">
              <a href="#fees" className="block cursor-pointer w-full h-full">
                {/* Desktop Banner */}
                <Image
                  src="/cta-banner.webp"
                  alt="Zeon Academy Special Offer"
                  width={1200}
                  height={200}
                  quality={100}
                  unoptimized
                  className="hidden md:block w-full h-auto object-cover"
                />
                {/* Mobile Banner */}
                <Image
                  src="/cta-mob.webp"
                  alt="Zeon Academy Special Offer"
                  width={850}
                  height={450}
                  quality={100}
                  unoptimized
                  className="block md:hidden w-full h-auto object-cover"
                />
              </a>
              {/* Overlay Button */}
              {/* <div className="absolute inset-0 pointer-events-none">
                <a
                  href="#fees"
                  className="pointer-events-auto absolute right-[8%] bottom-[4%] sm:right-[14%] sm:bottom-[6%] md:right-[19%] md:bottom-[8%] lg:right-[24%] lg:bottom-[11%] xl:right-[26%] xl:bottom-[13%] inline-flex items-center justify-center px-4 py-1.5 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3 rounded-full font-extrabold text-[0.75rem] sm:text-[0.95rem] lg:text-[1.05rem] bg-primary text-white shadow-glow transition-colors duration-300 hover:bg-primary-hover leading-tight"
                >
                  View Fee Details
                </a>
              </div> */}
            </div>
          </div>
        </section>
  );
}
