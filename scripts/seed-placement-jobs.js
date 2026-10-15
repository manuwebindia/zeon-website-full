const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JOBS_DATA = [
  {
    slug: 'video-editor-social-media-content-creator-pepebbq',
    jobTitle: 'Video Editor & Social Media Content Creator',
    companyName: 'PepeBBQ',
    location: 'Kaloor, Kochi',
    shiftSchedule: '9:00 AM – 6:00 PM, Monday to Saturday',
    phone: '8921766391',
    sourceUrl: 'View original job page',
    jobTypes: 'Full-time',
    aboutCompany: 'PepeBBQ specializes in premium BBQ grills, accessories, and outdoor cooking equipment for residential and commercial customers. The company works with hotels, restaurants, and hospitality businesses throughout Kerala.',
    responsibilities: `• Visit hotels and restaurants to photograph and record PepeBBQ products and installations.
• Produce Instagram Reels, YouTube Shorts, and WhatsApp videos.
• Create promotional posters and marketing materials.
• Plan content to improve brand visibility and engagement.
• Maintain consistent branding across all visual content.
• Manage Instagram, Facebook, Google, and YouTube accounts.
• Publish daily posts, stories, product highlights, and promotions.
• Manage product listings on Amazon, Swiggy Minis, and Grizzly.
• Update product information, inventory, and orders.
• Maintain a content schedule and report progress to management.`,
    skillsRequired: `• Proficiency in CapCut, Premiere Pro, VN, or similar editing tools.
• Basic graphic design skills using Canva.
• Digital marketing certification preferred.
• Creativity, organization, and a proactive attitude.`,
    eligibility: `• Degree or diploma in any discipline.
• Both freshers with a strong portfolio and experienced candidates may apply.`,
  },
  {
    slug: 'digital-marketing-intern-find-my-hostel',
    jobTitle: 'Digital Marketing Intern',
    companyName: 'Find My Hostel',
    location: 'Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Find original job page',
    jobTypes: 'Internship',
    aboutCompany: 'Find My Hostel helps students and working professionals find suitable hostels and paying guest accommodations. The platform focuses on verified listings, transparent pricing, convenient booking, and accommodation discovery across Kerala.',
    responsibilities: `• Support social media marketing campaigns across Instagram, Facebook, YouTube, and LinkedIn.
• Create captions, blog posts, and engaging content for audience discovery.
• Assist in basic graphic design for listings and promotions.
• Learn and implement SEO strategies to drive organic website traffic.
• Monitor campaign analytics and assist with paid advertising.`,
    skillsRequired: `• Understanding of Instagram, Facebook, YouTube, and LinkedIn.
• Basic graphic design using Canva, Photoshop, or equivalent tools.
• Knowledge of SEO, content strategy, and paid advertising.
• Good writing and communication skills for captions and blogs.
• Ability to manage multiple tasks and meet deadlines.`,
    eligibility: `• Creativity and an interest in social media trends.
• Willingness to contribute to digital marketing and content creation.
• Freshers, graduates, and digital marketing students eligible.`,
  },
  {
    slug: 'digital-marketing-trainee-indo-european-institute-of-engineering',
    jobTitle: 'Digital Marketing Trainee',
    companyName: 'Indo European Institute of Engineering (IEIE)',
    location: 'Aluva, Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Indo European Institute job page',
    jobTypes: 'Full-time / Trainee',
    aboutCompany: 'IEIE is a technical education and professional training institution offering engineering, technology, and skill development programs. Its focus is on practical education and preparing students for professional careers.',
    responsibilities: `• Assist in planning and implementing digital marketing campaigns.
• Produce engaging visual graphics and banners using Canva / Photoshop.
• Write compelling copy for student outreach and program promotions.
• Track and report campaign metrics and search rankings.`,
    skillsRequired: `• Knowledge of social media platforms and current digital trends.
• Basic graphic design skills using Canva, Photoshop, or Illustrator.
• Understanding of SEO and online advertising.
• Content writing and copywriting for social media and blogs.
• Communication and teamwork abilities.
• Ability to analyze campaign results and performance metrics.`,
    eligibility: `• Degree or diploma in any discipline.
• Digital marketing training or internship background preferred.`,
  },
  {
    slug: 'digital-marketing-interns-peraka-media',
    jobTitle: 'Digital Marketing Interns',
    companyName: 'Peraka Media',
    location: 'Kochi, Kerala',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Peraka Media job page',
    jobTypes: 'Internship',
    aboutCompany: 'Peraka Media is a creative agency specializing in advertising and digital marketing. The internship offers practical exposure to social media management, content production, search engine optimization, advertising campaigns, and analytics.',
    responsibilities: `• Support social media account management and scheduling.
• Assist in video and graphic content production for agency clients.
• Conduct research for search engine optimization and ad targeting.
• Help monitor Google Analytics and campaign performance reports.`,
    skillsRequired: `• Basic knowledge of Google Analytics, SEO, advertising, and social media.
• Strong communication and writing abilities.
• Creativity and willingness to learn.
• Ability to work independently and collaboratively.`,
    eligibility: `• Currently pursuing or recently completed a degree in marketing, business, communications, or a related discipline.`,
  },
  {
    slug: 'marketing-executive-ye-stack',
    jobTitle: 'Marketing Executive',
    companyName: 'YE Stack',
    location: 'Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'YE Stack job page',
    jobTypes: 'Full-time',
    aboutCompany: 'YE Stack is a technology and digital solutions company seeking a marketing professional to support its growth. The position involves planning marketing campaigns, maintaining client relationships, and contributing to online and offline promotional activities.',
    responsibilities: `• Plan and coordinate promotional marketing campaigns.
• Nurture client relationships and represent company solutions.
• Assist in online and offline branding initiatives.
• Execute lead generation strategies across digital channels.`,
    skillsRequired: `• Knowledge of digital marketing tools and techniques.
• Strong verbal and written communication.
• Basic understanding of content strategy and branding.
• Proactive approach and ability to work within a team.`,
    eligibility: `• Digital marketing or social media management training or certification is an advantage.
• Freshers with strong communication skills are welcome to apply.`,
  },
  {
    slug: 'video-editor-ishkhan-aviation-academy',
    jobTitle: 'Video Editor',
    companyName: 'Ishkhan Aviation Academy',
    location: 'Palarivattom, Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Ishkhan Aviation Academy job page',
    jobTypes: 'Full-time',
    aboutCompany: 'The academy is seeking a video editor to produce engaging visual content documenting its academic activities.',
    responsibilities: `• Record and edit videos of academic activities.
• Produce high-quality video content.
• Handle regular video recording and editing assignments.
• Deliver completed videos within deadlines.`,
    skillsRequired: `• Proficiency in video editing tools (Premiere Pro, CapCut, VN, etc.).
• Audio mixing, color grading, and video pacing skills.
• Ability to shoot and operate video equipment on campus.`,
    eligibility: `• Both freshers and experienced candidates may apply.
• Ability to record and edit videos with a portfolio.`,
  },
  {
    slug: 'content-creator-evolux-solutions',
    jobTitle: 'Content Creator',
    companyName: 'Evolux Solutions',
    location: 'Edappally, Ernakulam, Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Evolux Solutions job page',
    jobTypes: 'Full-time',
    aboutCompany: 'Evolux Solutions provides branding, social media marketing, paid advertising, SEO, growth strategy, website services, and content creation.',
    responsibilities: `• Develop engaging copy and storytelling concepts for client brands.
• Write blogs, captions, and ad scripts for Instagram, Facebook, and LinkedIn.
• Coordinate with the design team to ensure visual and textual harmony.
• Analyze content performance to increase conversions and engagement.`,
    skillsRequired: `• Excellent English writing skills; knowledge of a local language may also be useful.
• Ability to create compelling stories for brands, blogs, and social media.
• Understanding of Instagram, Facebook, and LinkedIn.
• Knowledge of how content supports brand awareness, audience engagement, and conversions.
• Ability to develop content suited to different platforms.`,
    eligibility: `• Degree in English, Mass Communication, Marketing, or relevant practical portfolio.`,
  },
  {
    slug: 'digital-marketing-trainee-adox-global-pvt-ltd',
    jobTitle: 'Digital Marketing Trainee',
    companyName: 'Adox Global Pvt. Ltd.',
    location: 'Ernakulam, Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Adox Global job page',
    jobTypes: 'Full-time / Trainee',
    aboutCompany: 'The position focuses on managing social media strategy, increasing brand visibility, engaging audiences, and supporting business objectives through digital platforms.',
    responsibilities: `• Plan and implement social media campaigns across platforms.
• Manage content calendars and schedule daily posts.
• Assist in basic SEO optimization and email marketing campaigns.
• Track platform metrics, audience feedback, and performance indicators.`,
    skillsRequired: `• Knowledge of social media marketing, content marketing, email marketing, and SEO.
• Familiarity with Facebook, X, Instagram, LinkedIn, and Pinterest.
• Understanding of platform-specific features, algorithms, and best practices.
• Ability to plan and implement social media campaigns.`,
    eligibility: `• Digital marketing training or certification.
• Freshers with strong practical digital marketing knowledge are encouraged to apply.`,
  },
  {
    slug: 'digital-marketing-neuflo-solutions',
    jobTitle: 'Digital Marketing',
    companyName: 'Neuflo Solutions',
    location: 'Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Neuflo Solutions job page',
    jobTypes: 'Full-time',
    aboutCompany: 'Neuflo Solutions is recruiting for digital marketing and web development positions.',
    responsibilities: `• Meta Ads campaign management and budget optimization.
• Google Ads campaign management and keyword bid adjustments.
• SEO optimization, on-page tagging, and search audits.
• Support web development projects using JavaScript and Webflow.`,
    skillsRequired: `• Willingness to learn and take responsibility for projects.
• Analytical and creative thinking.
• Leadership and communication.
• Project management skills.`,
    eligibility: `• Foundational knowledge and practical experience in Meta Ads, Google Ads, or SEO.`,
  },
  {
    slug: 'digital-marketer-whitesean-tv-news',
    jobTitle: 'Digital Marketer',
    companyName: 'Whitesean TV News',
    location: 'Edappally, Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Whitesean TV News job page',
    jobTypes: 'Full-time',
    aboutCompany: 'Whitesean TV News is a digital news and media organization looking for a full-time digital marketer to improve audience engagement, online visibility, and marketing performance.',
    responsibilities: `• Improve organic website traffic and search rankings.
• Generate qualified leads and sales through organic channels.
• Conduct keyword research and execute on-page SEO.
• Oversee technical SEO audits and backlink acquisition.
• Monitor performance using SEMrush, Google Analytics, and Search Console.`,
    skillsRequired: `• Keyword research and on-page SEO.
• Technical SEO and link building.
• Content strategy.
• SEMrush, Google Analytics, and Google Search Console.
• Analytical thinking and attention to detail.
• Ability to identify opportunities for organic growth.
• Communication and teamwork.`,
    eligibility: `• Practical experience in SEO, keyword optimization, and digital news promotion.`,
  },
  {
    slug: 'digital-marketer-ialm-edge',
    jobTitle: 'Digital Marketer',
    companyName: 'IALM Edge',
    location: 'Ernakulam, Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'IALM Edge job page',
    jobTypes: 'Full-time',
    aboutCompany: 'IALM Edge is a training and learning institution seeking a full-time digital marketer to manage and execute its digital marketing activities.',
    responsibilities: `• Manage Facebook, Instagram, LinkedIn, YouTube, and X accounts.
• Implement SEO best practices for website content and blogs.
• Monitor website analytics and search engine performance.
• Execute paid campaigns on Google Ads and Meta Ads Manager.`,
    skillsRequired: `• Understanding of digital marketing and social media management.
• Basic knowledge of SEO, SEM, and Google Analytics.
• Knowledge of SEO best practices for content creation.
• Familiarity with Google Analytics and Search Console.
• Experience managing Facebook, Instagram, LinkedIn, YouTube, and X.`,
    eligibility: `• Practical understanding of Google Ads and Meta Ads Manager.
• Prior training or internship in digital marketing.`,
  },
  {
    slug: 'digital-marketing-manager-thanima-farm-life',
    jobTitle: 'Digital Marketing Manager',
    companyName: 'Thanima Farm Life Pvt. Ltd.',
    location: 'Nalleppilly, Palakkad / Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Thanima Farm Life job page',
    jobTypes: 'Full-time',
    aboutCompany: 'This position involves leading digital marketing activities for a business focused on sustainable agriculture, tourism, wellness initiatives, and farm-based products.',
    responsibilities: `• Develop and execute comprehensive digital marketing strategies.
• Strengthen brand visibility across regional and national markets.
• Improve digital campaign performance through data-driven iterations.
• Increase audience engagement through storytelling and community building.
• Promote tourism, wellness activities, and farm-based products.`,
    skillsRequired: `• SEO, SEM, social media marketing, email campaigns, and performance advertising.
• Content strategy, storytelling, and community engagement.
• Meta Ads Manager, Google Analytics, Google Ads, and Canva or Adobe tools.
• Familiarity with CRM platforms.
• Leadership, communication, and project management.`,
    eligibility: `• Practical experience in marketing management or digital campaigns.
• Interest in sustainability, ecotourism, and cultural promotion preferred.`,
  },
  {
    slug: 'digital-marketing-intern-vr-digitals',
    jobTitle: 'Digital Marketing Intern',
    companyName: 'VR Digitals',
    location: 'Kakkanad, Ernakulam',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'VR Digitals job page',
    jobTypes: 'Internship',
    aboutCompany: 'The intern will work alongside the marketing team to support digital marketing activities and campaigns. The position provides practical exposure to digital marketing methods and industry practices.',
    responsibilities: `• Support day-to-day social media management and posting.
• Assist with email marketing campaigns and content drafting.
• Update CMS content and blog articles.
• Support the analytics team with Google Analytics tracking.`,
    skillsRequired: `• Strong written and verbal communication.
• Basic understanding of digital marketing channels.
• Familiarity with social media, email marketing, and content management systems.
• Proficiency in Microsoft Word, Excel, and PowerPoint.
• Knowledge of Google Analytics is an advantage.
• Attention to detail and the ability to work independently or in a team.`,
    eligibility: `• College students, freshers, or certified digital marketing trainees.`,
  },
  {
    slug: 'digital-marketing-executive-jinus-academy',
    jobTitle: 'Digital Marketing Executive',
    companyName: "Jinu’s Academy",
    location: 'Alappuzha',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: "Jinu's Academy job page",
    jobTypes: 'Full-time',
    aboutCompany: "Jinu’s Academy is seeking a creative digital marketing executive to support its marketing activities and online presence.",
    responsibilities: `• Drive student admissions via PPC advertising and Google Ads.
• Execute search engine optimization strategies for the academy website.
• Create social media campaigns and engage prospective students.
• Edit and design image and video promotional collaterals.`,
    skillsRequired: `• Understanding of digital marketing channels.
• Social media marketing.
• Search engine optimization.
• Email marketing and content marketing.
• Pay-per-click advertising.
• Image and video editing using Adobe software or similar tools.
• Good communication and teamwork.`,
    eligibility: `• At least one year of practical digital marketing experience, including relevant internships or entry-level work.`,
  },
  {
    slug: 'digital-marketing-intern-infinity-ideas',
    jobTitle: 'Digital Marketing Intern',
    companyName: 'Infinity Ideas',
    location: 'Maradu, Kerala',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Infinity Ideas job page',
    jobTypes: 'Internship',
    aboutCompany: 'The internship offers practical experience in online marketing, advertising campaigns, and brand development. The intern will support campaigns across social media, SEO, Google Ads, and Meta Ads.',
    responsibilities: `• Assist in campaign setup on Google Ads and Meta Ads Manager.
• Support SEO auditing, search console analysis, and keyword tracking.
• Create social media graphics using Canva or Photoshop.
• Prepare campaign reports and performance evaluations.`,
    skillsRequired: `• Basic knowledge of Google Ads, Meta Ads, Instagram, and LinkedIn.
• Familiarity with SEO, Google Analytics, and Search Console.
• Strong written and verbal communication.
• Creativity and multitasking.
• Ability to work in a collaborative environment.
• Proficiency in Microsoft Office.
• Basic Canva, Photoshop, or video editing skills are an advantage.`,
    eligibility: `• Freshers and students passionate about digital marketing and paid ads.`,
  },
  {
    slug: 'digital-marketer-team-ynes',
    jobTitle: 'Digital Marketer',
    companyName: 'Team Ynes',
    location: 'Kochi, Kerala',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Team Ynes job page',
    jobTypes: 'Full-time',
    aboutCompany: 'Team Ynes is a digital marketing and development company seeking a full-time digital marketer with design and digital marketing skills.',
    responsibilities: `• Manage client social media campaigns and brand presence.
• Design marketing collaterals and social media visuals.
• Execute digital marketing strategies to achieve client KPIs.
• Proactively explore and implement creative marketing concepts.`,
    skillsRequired: `• Digital marketing knowledge.
• Graphic design skills.
• Ability to support online marketing campaigns.
• Interest in developing creative marketing solutions.`,
    eligibility: `• Relevant qualification or certified training in digital marketing and design.`,
  },
  {
    slug: 'digital-marketer-black-onyx-international-llc',
    jobTitle: 'Digital Marketer',
    companyName: 'Black Onyx International LLC',
    location: 'Kakkanad, Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Black Onyx job page',
    jobTypes: 'Full-time',
    aboutCompany: 'Black Onyx International LLC is a recruitment company seeking a digital marketer with experience in social media, digital marketing, graphic design, and video production.',
    responsibilities: `• Create marketing videos and images.
• Manage social media accounts.
• Execute digital marketing strategies.
• Support brand promotion and online visibility.`,
    skillsRequired: `• Social media marketing.
• Digital marketing.
• Graphic design.
• Creative video production.`,
    eligibility: `• At least two years of experience in digital marketing and content creation.
• A portfolio of creative work is preferred.`,
  },
  {
    slug: 'digital-marketing-intern-oppiatec-consulting-pvt-ltd',
    jobTitle: 'Digital Marketing Intern',
    companyName: 'Oppiatec Consulting Pvt. Ltd.',
    location: 'Kochi, Kerala',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Oppiatec Consulting job page',
    jobTypes: 'Internship',
    aboutCompany: 'The intern will assist with digital marketing strategies for recruitment campaigns. The position provides practical experience in generating website traffic, engagement, and conversions through online channels.',
    responsibilities: `• Assist in recruitment marketing campaigns across digital media.
• Drive website visits, user engagement, and inquiry conversions.
• Maintain social media channels and track lead generation.`,
    skillsRequired: `• Digital marketing knowledge.
• Good communication skills.`,
    eligibility: `• Graduate with completed digital marketing training.
• Candidate must be based in Kochi.`,
  },
  {
    slug: 'digital-marketing-specialist-and-graphic-designer-edbe',
    jobTitle: 'Digital Marketing Specialist and Graphic Designer',
    companyName: 'Edbe — Experts in Global Education',
    location: 'Kochi, Kerala',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Edbe job page',
    jobTypes: 'Full-time',
    aboutCompany: 'Edbe is a study-abroad consultancy headquartered in Kochi, with its head office in the UK. The company provides guidance to students planning to pursue education overseas. The role combines graphic design and digital marketing to strengthen the company’s brand presence.',
    responsibilities: `• Design high-impact visual banners, brochures, and social creatives.
• Plan and run overseas education digital marketing campaigns.
• Manage online lead generation funnels for university admissions.
• Maintain brand consistency across all marketing collateral.`,
    skillsRequired: `• Graphic design.
• Content creation.
• Digital marketing.`,
    eligibility: `• Diploma in graphic design.
• A degree is preferred.
• Thorough knowledge of digital marketing.
• At least two years of graphic design experience.
• At least one year of digital marketing experience.`,
  },
  {
    slug: 'digital-marketing-specialist-vintage-events',
    jobTitle: 'Digital Marketing Specialist',
    companyName: 'Vintage Events Pvt. Ltd.',
    location: 'Thodupuzha / Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'Vintage Events job page',
    jobTypes: 'Full-time',
    aboutCompany: 'Vintage Events is an event management company seeking a digital marketing specialist to promote its events and improve its online presence.',
    responsibilities: `• Manage social media platforms.
• Implement SEO strategies.
• Run Meta advertising campaigns.
• Increase engagement and online visibility.
• Develop creative promotional ideas for events.`,
    skillsRequired: `• Social media marketing, Meta advertising, and SEO.
• Creative promotional ideas for live and corporate events.`,
    eligibility: `• Relevant experience in event marketing or digital advertising.`,
  },
  {
    slug: 'digital-marketer-maad-concepts',
    jobTitle: 'Digital Marketer',
    companyName: 'MAAD Concepts',
    location: 'Edappally, Kochi',
    shiftSchedule: 'Day Shift',
    phone: '7558888252',
    sourceUrl: 'MAAD Concepts job page',
    jobTypes: 'Full-time',
    aboutCompany: 'MAAD Concepts is an architecture and interior design firm seeking a digital marketer to increase brand awareness and promote its projects and services.',
    responsibilities: `• Improve website visibility through SEO.
• Manage social media marketing.
• Conduct YouTube marketing.
• Create digital content.
• Manage Google Ads campaigns.
• Run targeted Meta advertising campaigns.
• Update and maintain the company website.
• Produce video reels showcasing projects and services.
• Manage and grow the company’s social media presence.`,
    skillsRequired: `• SEO and social media marketing.
• Google Ads and Meta Ads Manager.
• Content creation.
• Website management.
• Video production.
• Social media strategy.`,
    eligibility: `• Background in digital marketing for architecture, design, or lifestyle brands.`,
  },
  {
    slug: 'digital-marketing-executive-techrish',
    jobTitle: 'Digital Marketing Executive',
    companyName: 'Techrish',
    location: 'Kakkanad, Kochi',
    shiftSchedule: 'Day Shift (On-site)',
    phone: '7558888252',
    sourceUrl: 'Techrish job page',
    jobTypes: 'Full-time',
    aboutCompany: 'Techrish is seeking an on-site digital marketing executive to support business growth across the UAE, Qatar, Saudi Arabia, Europe, and Africa.',
    responsibilities: `• Generate leads through Google Ads, SEO, and social media marketing.
• Create digital marketing content.
• Monitor website analytics.
• Manage social media accounts.
• Improve brand visibility.
• Coordinate marketing initiatives to achieve business goals.`,
    skillsRequired: `• Google Ads, SEO, and social media marketing.
• Lead generation and international audience targeting.
• Website analytics and performance monitoring.`,
    eligibility: `• Digital marketing experience or professional certification. On-site at Kakkanad.`,
  },
  {
    slug: 'online-sales-personnel-maharajas-textiles',
    jobTitle: 'Online Sales Personnel',
    companyName: 'Maharajas Textiles',
    location: 'Vazhakulam, Kochi',
    shiftSchedule: 'Part-time or Full-time',
    phone: '7558888252',
    sourceUrl: 'Maharajas Textiles job page',
    jobTypes: 'Part-time / Full-time',
    aboutCompany: 'Maharajas Textiles is an established textile retailer seeking enthusiastic individuals to support its online sales activities.',
    responsibilities: `• Support online marketing and sales.
• Assist with promoting textile products.
• Contribute to online customer engagement.
• Support promotional activities and product presentation.`,
    skillsRequired: `• Online marketing knowledge.
• Sales and communication abilities.
• Interest in textiles and digital marketing.
• Confidence in presenting products online.`,
    eligibility: `• Part-time or full-time opportunities available. Freshers and students welcome.`,
  },
];

async function main() {
  console.log(`Starting placement jobs sync for ${JOBS_DATA.length} positions...`);

  // First fetch all existing jobs in job_postings
  const existingJobs = await prisma.jobPosting.findMany();
  console.log(`Found ${existingJobs.length} existing job postings in database.`);

  for (const job of JOBS_DATA) {
    // Try to find matching job by slug or companyName / jobTitle
    let match = existingJobs.find(
      (j) => j.slug === job.slug ||
        (j.companyName && j.companyName.toLowerCase().includes(job.companyName.toLowerCase().slice(0, 8)))
    );

    if (match) {
      console.log(`Updating existing job ${match.id} -> ${job.companyName} (${job.slug})`);
      await prisma.jobPosting.update({
        where: { id: match.id },
        data: {
          slug: job.slug,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          location: job.location,
          shiftSchedule: job.shiftSchedule,
          phone: job.phone,
          sourceUrl: job.sourceUrl,
          jobTypes: job.jobTypes,
          aboutCompany: job.aboutCompany,
          responsibilities: job.responsibilities,
          skillsRequired: job.skillsRequired,
          eligibility: job.eligibility,
          status: 'approved',
          approvedAt: match.approvedAt || new Date(),
        },
      });
    } else {
      console.log(`Creating new job for ${job.companyName} (${job.slug})`);
      await prisma.jobPosting.create({
        data: {
          slug: job.slug,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          location: job.location,
          shiftSchedule: job.shiftSchedule,
          phone: job.phone,
          sourceUrl: job.sourceUrl,
          jobTypes: job.jobTypes,
          aboutCompany: job.aboutCompany,
          responsibilities: job.responsibilities,
          skillsRequired: job.skillsRequired,
          eligibility: job.eligibility,
          status: 'approved',
          approvedAt: new Date(),
          source: 'seed',
        },
      });
    }
  }

  // Also make sure any remaining existing jobs without a slug get a sensible slug
  const remaining = await prisma.jobPosting.findMany({ where: { slug: null } });
  for (const r of remaining) {
    const fallbackSlug = (r.jobTitle + '-' + r.companyName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    console.log(`Assigning fallback slug for ${r.companyName}: ${fallbackSlug}`);
    await prisma.jobPosting.update({
      where: { id: r.id },
      data: { slug: fallbackSlug },
    });
  }

  console.log('Sync complete!');
}

main()
  .catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
