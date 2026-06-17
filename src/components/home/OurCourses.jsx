import dynamic from "next/dynamic";
import CourseCard from "../CourseCard";
import ScrollReveal from "../ScrollReveal";

const CourseTabs = dynamic(() => import("../CourseTabs"));

export default function OurCourses() {
  return (
        <section id="program" className="py-10 md:py-14 lg:py-16 xl:py-20 bg-surface bg-grid-pattern">
          <div className="w-full max-w-[1200px] mx-auto px-6">
            <ScrollReveal direction="up" distance={40}>
              <div className="text-center mb-[4.5rem] max-w-6xl mx-auto">
                <span className="inline-block text-primary text-[0.85rem] font-semibold mb-5 tracking-[0.2em] uppercase">
                  Our Courses
                </span>
                <h2 className="text-[clamp(2.2rem,4vw,3rem)] font-extrabold text-heading mb-4 leading-tight">
                  Choose Your Digital Marketing{" "}
                  <span className="text-primary">Program</span>
                </h2>
                <p className="text-[1.15rem] text-body leading-relaxed font-medium">
                  Specialized programs designed to support your digital marketing
                  career growth.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" distance={50} delay={0.1}>
              <CourseTabs
                offlineCourses={
                  <>
                    <CourseCard
                      mode="offline"
                      title="Advanced Digital Marketing Course"
                      price="₹28,000"
                      duration="2 Months + 1 Month Internship"
                      targetGroup="Beginners, freshers, job seekers, and career switchers who want complete 360-degree digital marketing training."
                      description="A complete, practical 60-day program that teaches all major areas of digital marketing using real tools, real campaigns, and placement-focused training."
                      learnList={[
                        "Build a Digital Marketing Strategy",
                        "Optimize Websites for SEO",
                        "Drive Organic Traffic with SEO",
                        "Create a Content Strategy Plan",
                        "Identify and Target Your Audience",
                      ]}
                      extraTopics="+4 more topics"
                      isPopular={true}
                      syllabus={[
                        { title: "Module 1: Introduction to Digital Marketing", topics: [] },
                        { title: "Module 2: Market Research & Content Marketing", topics: [] },
                        { title: "Module 3: Copywriting & Content Writing", topics: [] },
                        { title: "Module 4: Basics of Graphic Designing", topics: [] },
                        { title: "Module 5: Website Fundamentals", topics: [] },
                        { title: "Module 6: WordPress", topics: [] },
                        { title: "Module 7: Search Engine Optimization (SEO)", topics: [] },
                        { title: "Module 8: Google Search Console", topics: []},
                        { title: "Module 9: Google Analytics & Tag Manager", topics: []},
                        { title: "Module 10: Google Ads", topics: []},
                        { title: "Module 11: Conversion Rate Optimization (CRO)", topics: []},
                        { title: "Module 12: Social Media Marketing", topics: []},
                        { title: "Module 13: Email Marketing", topics: []},
                        { title: "Module 14: Youtube Marketing", topics: []},
                        { title: "Module 15: Automated & Affiliate Marketing", topics: []},
                      ]}
                    />

                    <CourseCard
                      mode="offline"
                      title="SEO Specialist Course"
                      price="₹11,999"
                      duration="15 Days + 1 Month Internship"
                      // hasGST={true}
                      targetGroup="Students who want to specialize in SEO and increase website rankings and visibility."
                      description="A fast-track SEO program designed to build strong search optimization skills in just 15 days."
                      learnList={[
                        "Understand How SEO Works",
                        "Discover the Best Keywords",
                        "Structure and Optimize Webpages",
                        "Master Technical SEO",
                        "Build High-Quality Backlinks",
                      ]}
                      isPopular={false}
                      syllabus={[
                        { title: "Module 1: SEO Fundamentals", topics: [] },
                        { title: "Module 2: Keyword Research", topics: [] },
                        { title: "Module 3: On-Page SEO", topics: [] },
                        { title: "Module 4: Technical SEO", topics: [] },
                        { title: "Module 5: Off-Page SEO", topics: [] },
                        { title: "Module 6: SEO Tools", topics: [] },
                        { title: "Module 7: Local SEO", topics: [] },
                        { title: "Module 8: Content SEO", topics: [] },
                        { title: "Module 9: SEO Audit & Reporting", topics: [] },
                        { title: "Module 10: Final Project", topics: [] },
                      ]}
                    />

                    <CourseCard
                      mode="offline"
                      title="AD Specialist Course"
                      price="₹9,999"
                      // hasGST={true}
                      duration="10 Days"
                      targetGroup="Students who want to master social media ads and performance-based advertising quickly."
                      description="A 10-day intensive training focused on creating, managing, and optimizing high-performance social media ad campaigns."
                      learnList={[
                        "Manage Social Media for Brands",
                        "Analyze Social Media Reach & Feasibility",
                        "Drive Traffic to Websites",
                        "Rapidly Grow Online Audiences",
                      ]}
                      isPopular={false}
                      syllabus={[
                        { title: "Module 1: Digital Advertising Foundations", topics: [] },
                        { title: "Module 2: Social Media Account Setup", topics: [] },
                        { title: "Module 3: Google Ads - Search, Display & Video", topics: [] },
                        { title: "Module 4: Meta Ads (Facebook & Instagram Advertising)", topics: [] },
                        { title: "Module 5: Audience Targeting & Funnel Strategy", topics: [] },
                        { title: "Module 6: Ad Creatives & Copywriting", topics: [] },
                        { title: "Module 7: Campaign Optimization & Scaling", topics: [] },
                        { title: "Module 8: Live Campaign & Final Project", topics: [] },
                      ]}
                    />
                  </>
                }
                onlineCourses={
                  <>
                    <CourseCard
                      mode="online"
                      title="Advanced Digital Marketing Course"
                      price="₹23,000"
                      duration="2 Months + 1 Month Internship"
                      targetGroup="Beginners, freshers, job seekers, and career switchers who want complete 360-degree digital marketing training."
                      description="A complete, practical 60-day program that teaches all major areas of digital marketing using real tools, real campaigns, and placement-focused training."
                      learnList={[
                        "Build a Digital Marketing Strategy",
                        "Optimize Websites for SEO",
                        "Drive Organic Traffic with SEO",
                        "Create a Content Strategy Plan",
                        "Identify and Target Your Audience",
                      ]}
                      extraTopics="+4 more topics"
                      isPopular={true}
                      syllabus={[
                        { title: "Module 1: Introduction to Digital Marketing", topics: [] },
                        { title: "Module 2: Market Research & Content Marketing", topics: [] },
                        { title: "Module 3: Copywriting & Content Writing", topics: [] },
                        { title: "Module 4: Basics of Graphic Designing", topics: [] },
                        { title: "Module 5: Website Fundamentals", topics: [] },
                        { title: "Module 6: WordPress", topics: [] },
                        { title: "Module 7: Search Engine Optimization (SEO)", topics: [] },
                        { title: "Module 8: Google Search Console", topics: []},
                        { title: "Module 9: Google Analytics & Tag Manager", topics: []},
                        { title: "Module 10: Google Ads", topics: []},
                        { title: "Module 11: Conversion Rate Optimization (CRO)", topics: []},
                        { title: "Module 12: Social Media Marketing", topics: []},
                        { title: "Module 13: Email Marketing", topics: []},
                        { title: "Module 14: Youtube Marketing", topics: []},
                        { title: "Module 15: Automated & Affiliate Marketing", topics: []},
                      ]}
                    />

                    <CourseCard
                      mode="online"
                      title="SEO Specialist Course"
                      price="₹11,999"
                      duration="15 Days + 1 Month Internship"
                      // hasGST={true}
                      targetGroup="Students who want to specialize in SEO and increase website rankings and visibility."
                      description="A fast-track SEO program designed to build strong search optimization skills in just 15 days."
                      learnList={[
                        "Understand How SEO Works",
                        "Discover the Best Keywords",
                        "Structure and Optimize Webpages",
                        "Master Technical SEO",
                        "Build High-Quality Backlinks",
                      ]}
                      isPopular={false}
                      syllabus={[
                        { title: "Module 1: SEO Fundamentals", topics: [] },
                        { title: "Module 2: Keyword Research", topics: [] },
                        { title: "Module 3: On-Page SEO", topics: [] },
                        { title: "Module 4: Technical SEO", topics: [] },
                        { title: "Module 5: Off-Page SEO", topics: [] },
                        { title: "Module 6: SEO Tools", topics: [] },
                        { title: "Module 7: Local SEO", topics: [] },
                        { title: "Module 8: Content SEO", topics: [] },
                        { title: "Module 9: SEO Audit & Reporting", topics: [] },
                        { title: "Module 10: Final Project", topics: [] },
                      ]}
                    />

                    <CourseCard
                      mode="online"
                      title="AD Specialist Course"
                      price="₹9,999"
                      duration="10 Days"
                      // hasGST={true}
                      targetGroup="Students who want to master social media ads and performance-based advertising quickly."
                      description="A 10-day intensive training focused on creating, managing, and optimizing high-performance social media ad campaigns."
                      learnList={[
                        "Manage Social Media for Brands",
                        "Analyze Social Media Reach & Feasibility",
                        "Drive Traffic to Websites",
                        "Rapidly Grow Online Audiences",
                      ]}
                      isPopular={false}
                      syllabus={[
                        { title: "Module 1: Digital Advertising Foundations", topics: [] },
                        { title: "Module 2: Social Media Account Setup", topics: [] },
                        { title: "Module 3: Google Ads - Search, Display & Video", topics: [] },
                        { title: "Module 4: Meta Ads (Facebook & Instagram Advertising)", topics: [] },
                        { title: "Module 5: Audience Targeting & Funnel Strategy", topics: [] },
                        { title: "Module 6: Ad Creatives & Copywriting", topics: [] },
                        { title: "Module 7: Campaign Optimization & Scaling", topics: [] },
                        { title: "Module 8: Live Campaign & Final Project", topics: [] },
                      ]}
                    />
                  </>
                }
              />
            </ScrollReveal>
          </div>
        </section>
  );
}
