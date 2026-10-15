import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  summary: string;
  location: string;
  email: string;
  phone: string;
  photo_url: string | null;
  resume_url: string | null;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  tagline: string;
  footer_text: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  description: string;
  sort_order: number;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  start_date: string | null;
  end_date: string | null;
  description: string;
  technologies: string[];
  sort_order: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  sort_order: number;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  issue_date: string | null;
  credential_id: string;
  credential_url: string;
  sort_order: number;
}

export interface Language {
  id: string;
  language: string;
  level: string;
  sort_order: number;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  award_date: string | null;
  description: string;
  sort_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  features: string[];
  technologies: string[];
  cover_image_url: string | null;
  github_url: string;
  live_url: string;
  year: number | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt: string;
  sort_order: number;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  category: string;
  achievement_date: string | null;
  description: string;
  certificate_url: string | null;
  certificate_type: string;
  credential_id: string;
  credential_url: string;
  featured: boolean;
  sort_order: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  sort_order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface PosterDesign {
  id: string;
  title: string;
  category: string;
  image_url: string;
  description: string;
  sort_order: number;
}

// ==========================================
// Verified Defaults from CV.pdf & Profile.pdf
// ==========================================

export const DEFAULT_PROFILE: Profile = {
  id: "profile-nayan",
  full_name: "Md. Nahid Niaz Nayan",
  title: "Computer Science Undergraduate | IT & Digital Media Specialist",
  bio: "Pursuing a Bachelor's degree in Computer Science and Engineering at BRAC University. Serving as Director of IT at the BRAC University Natural Sciences Club and Assistant Director, HR at the BRAC University Response Team, with strong skills in Python, digital media creation, web platforms, and data management.",
  summary: "Undergraduate student in Computer Science and Engineering at BRAC University with extensive hands-on experience in IT operations, digital branding, multimedia content creation, and team leadership. Skilled in Python, object-oriented programming, discrete mathematics, Canva Pro graphic design, CapCut video editing, and modern web tools. Dedicated to delivering high-impact solutions and driving organizational growth.",
  location: "Dhaka, Bangladesh",
  email: "nahid.niaz.nayan@g.bracu.ac.bd",
  phone: "01701664688",
  photo_url: "/Picture/Nayan.jpg",
  resume_url: "/Cv.pdf",
};

export const DEFAULT_SETTINGS: SiteSettings = {
  id: "settings-nayan",
  site_name: "Md. Nahid Niaz Nayan",
  tagline: "Computer Science Undergraduate | IT & Digital Media Specialist",
  footer_text: "Md. Nahid Niaz Nayan. All rights reserved.",
};

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    id: "social-linkedin",
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/md-nahid-niaz-nayan",
    sort_order: 0,
  },
  {
    id: "social-email",
    platform: "Email",
    url: "mailto:nahid.niaz.nayan@g.bracu.ac.bd",
    sort_order: 1,
  },
];

export const DEFAULT_EDUCATION: Education[] = [
  {
    id: "edu-bracu",
    degree: "B.Sc. in Computer Science & Engineering",
    institution: "BRAC University",
    location: "Dhaka, Bangladesh",
    start_date: "2023-01-01",
    end_date: null,
    description: "Currently pursuing Bachelor of Science in Computer Science and Engineering. Focusing on Python, Object-Oriented Programming (OOP), Data Structures, Algorithms, and Discrete Mathematics while actively leading IT and HR operations in university student clubs.",
    sort_order: 0,
  },
  {
    id: "edu-edward",
    degree: "Higher Secondary Certificate (HSC) — Science",
    institution: "Govt. Edward College, Pabna",
    location: "Pabna, Bangladesh",
    start_date: "2019-07-01",
    end_date: "2021-12-01",
    description: "Completed Higher Secondary Certificate in Science division with a perfect GPA of 5.00/5.00.",
    sort_order: 1,
  },
  {
    id: "edu-bhangoora",
    degree: "Secondary School Certificate (SSC) — Science",
    institution: "Bhangoora Biggan School & College",
    location: "Pabna, Bangladesh",
    start_date: "2014-01-01",
    end_date: "2019-05-01",
    description: "Completed Secondary School Certificate curriculum with strong foundations in science and mathematics.",
    sort_order: 2,
  },
];

export const DEFAULT_EXPERIENCE: Experience[] = [
  {
    id: "exp-bunsc",
    position: "Director of IT",
    company: "BRAC University Natural Sciences Club (BUNSC)",
    location: "Dhaka, Bangladesh",
    start_date: "2024-01-01",
    end_date: "2025-12-31",
    description: "Created visually compelling posters for almost all BRAC University Natural Science Club events using Canva Pro, elevating the club's branding and outreach. Led social media management and video editing with Canva & CapCut, ensuring consistent, high-quality content that effectively engaged the university community. Oversaw technical and multimedia operations for seminars, workshops, and science outreach programs.",
    technologies: ["Canva Pro", "CapCut", "Social Media Strategy", "Digital Branding", "Content Planning", "IT Operations"],
    sort_order: 0,
  },
  {
    id: "exp-response-team",
    position: "Assistant Director, Human Resources",
    company: "BRAC University Response Team",
    location: "Dhaka, Bangladesh",
    start_date: "2024-01-01",
    end_date: "2025-12-31",
    description: "Efficiently managed organizational data and documentation using Google Sheets and Docs, ensuring high accuracy and smooth HR operations within the BRAC University Response Team. Strengthened team communication and relationships while consistently meeting deadlines, contributing to effective emergency response coordination and timely project execution.",
    technologies: ["Google Sheets", "Google Docs", "HR Operations", "Data Management", "Team Collaboration"],
    sort_order: 1,
  },
];

export const DEFAULT_SKILLS: Skill[] = [
  // Programming & Core CS
  { id: "sk-python", name: "Python", category: "Programming & Core CS", level: 4, sort_order: 0 },
  { id: "sk-oop", name: "Object-Oriented Programming (OOP)", category: "Programming & Core CS", level: 4, sort_order: 1 },
  { id: "sk-discrete-math", name: "Discrete Mathematics", category: "Programming & Core CS", level: 4, sort_order: 2 },
  { id: "sk-dsa", name: "Data Structures & Algorithms", category: "Programming & Core CS", level: 3, sort_order: 3 },

  // Web & Digital Platforms
  { id: "sk-wp", name: "WordPress Web Development", category: "Web & Digital Platforms", level: 4, sort_order: 4 },
  { id: "sk-squarespace", name: "Squarespace Web Design", category: "Web & Digital Platforms", level: 4, sort_order: 5 },
  { id: "sk-seo", name: "Search Engine Optimization (SEO)", category: "Web & Digital Platforms", level: 4, sort_order: 6 },
  { id: "sk-google-ads", name: "Google Ads Campaigns", category: "Web & Digital Platforms", level: 4, sort_order: 7 },

  // Creative Media & Design
  { id: "sk-canva", name: "Canva Pro Poster & Graphic Design", category: "Creative Media & Design", level: 5, sort_order: 8 },
  { id: "sk-capcut", name: "CapCut Video Editing & Production", category: "Creative Media & Design", level: 5, sort_order: 9 },
  { id: "sk-branding", name: "Digital Branding & Visual Identity", category: "Creative Media & Design", level: 5, sort_order: 10 },
  { id: "sk-social-media", name: "Social Media Strategy & Growth", category: "Creative Media & Design", level: 5, sort_order: 11 },
  { id: "sk-content-plan", name: "Content Planning & Scheduling", category: "Creative Media & Design", level: 5, sort_order: 12 },

  // Productivity & Operations
  { id: "sk-sheets", name: "Google Sheets (Data Management)", category: "Productivity & Operations", level: 5, sort_order: 13 },
  { id: "sk-office", name: "Microsoft Office (Word, Excel, PowerPoint)", category: "Productivity & Operations", level: 5, sort_order: 14 },
  { id: "sk-email", name: "Professional Email Writing", category: "Productivity & Operations", level: 5, sort_order: 15 },
  { id: "sk-teamwork", name: "Team Leadership & Collaboration", category: "Productivity & Operations", level: 5, sort_order: 16 },
];

export const DEFAULT_CERTIFICATIONS: Certification[] = [
  {
    id: "cert-wp",
    name: "Build a free website with WordPress",
    organization: "Coursera Project Network",
    issue_date: "2024-08-01",
    credential_id: "J711I5U5XB9H",
    credential_url: "https://www.coursera.org/account/accomplishments/records/J711I5U5XB9H",
    sort_order: 0,
  },
  {
    id: "cert-excel",
    name: "Introduction to Microsoft Excel",
    organization: "Coursera Project Network",
    issue_date: "2024-08-01",
    credential_id: "GR9LRG9EKF47",
    credential_url: "https://www.coursera.org/account/accomplishments/records/GR9LRG9EKF47",
    sort_order: 1,
  },
  {
    id: "cert-gads",
    name: "Google Ads for Beginners",
    organization: "Coursera",
    issue_date: "2024-08-01",
    credential_id: "6HPC189OPD2N",
    credential_url: "https://www.coursera.org/account/accomplishments/records/6HPC189OPD2N",
    sort_order: 2,
  },
  {
    id: "cert-email",
    name: "Email Writing",
    organization: "10 Minute School",
    issue_date: "2024-08-01",
    credential_id: "66c22fc3d7484",
    credential_url: "https://www.linkedin.com/in/md-nahid-niaz-nayan",
    sort_order: 3,
  },
  {
    id: "cert-drama",
    name: "Stage Drama (Residential Semester Extra-Curricular)",
    organization: "BRAC University",
    issue_date: "2024-02-01",
    credential_id: "",
    credential_url: "https://www.linkedin.com/in/md-nahid-niaz-nayan",
    sort_order: 4,
  },
  {
    id: "cert-seo",
    name: "Search Engine Optimization (SEO) with Squarespace",
    organization: "Coursera Project Network",
    issue_date: "2024-04-10",
    credential_id: "COURSERA-SEO-02",
    credential_url: "https://www.coursera.org",
    sort_order: 5,
  },
];

export const DEFAULT_LANGUAGES: Language[] = [
  { id: "lang-bn", language: "Bengali", level: "Native", sort_order: 0 },
  { id: "lang-en", language: "English", level: "Professional Working Proficiency", sort_order: 1 },
];

export const DEFAULT_AWARDS: Award[] = [
  {
    id: "award-gpa5",
    title: "Academic Excellence — HSC GPA 5.00",
    organization: "Govt. Edward College, Pabna & Education Board",
    award_date: "2021-12-01",
    description: "Achieved the highest distinction of GPA 5.00 (out of 5.00) in the Higher Secondary Certificate (HSC) in Science group.",
    sort_order: 0,
  },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach-bunsc",
    title: "Director of IT Leadership Appointment",
    organization: "BRAC University Natural Sciences Club",
    category: "Leadership",
    achievement_date: "2024-01-01",
    description: "Appointed as Director of IT in recognition of exceptional contribution to digital branding, event promotions, and creative multimedia outreach for club initiatives.",
    certificate_url: "/Picture/Achievement Picture/Director of IT Leadership Appointment.png",
    certificate_type: "image/png",
    credential_id: "",
    credential_url: "https://www.linkedin.com/in/md-nahid-niaz-nayan",
    featured: true,
    sort_order: 0,
  },
  {
    id: "ach-drama",
    title: "Stage Drama — Extra Curricular Activity",
    organization: "BRAC University",
    category: "Leadership & Cultural",
    achievement_date: "2024-02-01",
    description: "Successful completion of STAGE DRAMA as an Extra Curricular Activity at Residential Semester, BRAC University.",
    certificate_url: "/Picture/Achievement Picture/Stage Drama.png",
    certificate_type: "image/png",
    credential_id: "",
    credential_url: "https://www.linkedin.com/in/md-nahid-niaz-nayan",
    featured: true,
    sort_order: 1,
  },
  {
    id: "ach-email",
    title: "Email Writing Professional Certification",
    organization: "10 Minute School",
    category: "Professional Certification",
    achievement_date: "2024-08-01",
    description: "Certified professional competence in formal email writing, business communication, and professional correspondence.",
    certificate_url: "/Picture/Achievement Picture/Email Writing.png",
    certificate_type: "image/png",
    credential_id: "66c22fc3d7484",
    credential_url: "https://www.linkedin.com/in/md-nahid-niaz-nayan",
    featured: true,
    sort_order: 2,
  },
  {
    id: "ach-cert-wp",
    title: "Build a free website with WordPress",
    organization: "Coursera Project Network",
    category: "Professional Certification",
    achievement_date: "2024-08-01",
    description: "Guided project certification covering responsive website architecture, page design, themes, and content management on WordPress.",
    certificate_url: "/Picture/Achievement Picture/Build a free website with WordPress.png",
    certificate_type: "image/png",
    credential_id: "J711I5U5XB9H",
    credential_url: "https://www.coursera.org/account/accomplishments/records/J711I5U5XB9H",
    featured: true,
    sort_order: 3,
  },
  {
    id: "ach-excel",
    title: "Introduction to Microsoft Excel",
    organization: "Coursera Project Network",
    category: "Professional Certification",
    achievement_date: "2024-08-01",
    description: "Hands-on certification demonstrating spreadsheet data organization, formulas, functions, formatting, and analysis workflows.",
    certificate_url: "/Picture/Achievement Picture/Introduction to Microsoft Excel.png",
    certificate_type: "image/png",
    credential_id: "GR9LRG9EKF47",
    credential_url: "https://www.coursera.org/account/accomplishments/records/GR9LRG9EKF47",
    featured: true,
    sort_order: 4,
  },
  {
    id: "ach-gads",
    title: "Google Ads for Beginners",
    organization: "Coursera",
    category: "Professional Certification",
    achievement_date: "2024-08-01",
    description: "Hands-on guided certification in search engine advertising, keyword targeting, ad campaign structure, and conversion bidding strategies.",
    certificate_url: "/Picture/Achievement Picture/Google Ads for Beginners.png",
    certificate_type: "image/png",
    credential_id: "6HPC189OPD2N",
    credential_url: "https://www.coursera.org/account/accomplishments/records/6HPC189OPD2N",
    featured: true,
    sort_order: 5,
  },
  {
    id: "ach-cert-seo",
    title: "Search Engine Optimization (SEO) Certification",
    organization: "Coursera Project Network",
    category: "Professional Certification",
    achievement_date: "2024-04-10",
    description: "Mastered on-page and architectural SEO strategies to elevate website visibility and search rankings.",
    certificate_url: "/Picture/Achievement Picture/Search Engine Optimization (SEO) Certification.png",
    certificate_type: "image/png",
    credential_id: "COURSERA-SEO-02",
    credential_url: "https://www.coursera.org",
    featured: false,
    sort_order: 6,
  },
  {
    id: "ach-hr",
    title: "Assistant Director of Human Resources Appointment",
    organization: "BRAC University Response Team",
    category: "Leadership & Management",
    achievement_date: "2024-01-01",
    description: "Selected to lead HR operations, data management workflows, and internal team communication for the university emergency and response student organization.",
    certificate_url: null,
    certificate_type: "application/pdf",
    credential_id: "",
    credential_url: "https://www.linkedin.com/in/md-nahid-niaz-nayan",
    featured: false,
    sort_order: 7,
  },
  {
    id: "ach-gpa5",
    title: "HSC GPA 5.00 Academic Excellence",
    organization: "Govt. Edward College, Pabna",
    category: "Academic",
    achievement_date: "2021-12-01",
    description: "Achieved maximum GPA 5.00 in the Higher Secondary Certificate (Science group), reflecting strong academic rigor in physics, chemistry, mathematics, and biology.",
    certificate_url: null,
    certificate_type: "application/pdf",
    credential_id: "",
    credential_url: "",
    featured: false,
    sort_order: 8,
  },
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj-bunsc",
    title: "BUNSC Event Branding & Digital Media Outreach",
    slug: "bunsc-branding-media",
    short_description: "End-to-end digital branding, promotional poster design, and video campaigns for BRAC University Natural Sciences Club.",
    description: "As Director of IT at the BRAC University Natural Sciences Club, directed and executed end-to-end digital branding and multimedia campaigns for major campus events, seminars, and science exhibitions. Created visually compelling posters using Canva Pro, edited dynamic video trailers with CapCut, and scheduled social media releases to maximize student engagement and event attendance.",
    features: [
      "Complete event visual branding and themed poster suites created with Canva Pro",
      "High-engagement video reels, trailers, and recap highlights produced using CapCut",
      "Strategic multi-platform social media scheduling and community engagement",
      "Coordinated with executive leadership to elevate club visibility across BRAC University",
    ],
    technologies: ["Canva Pro", "CapCut", "Digital Branding", "Social Media Strategy", "Content Planning"],
    cover_image_url: null,
    github_url: "",
    live_url: "https://www.linkedin.com/in/md-nahid-niaz-nayan",
    year: 2024,
    featured: true,
    published: true,
    sort_order: 0,
  },
  {
    id: "proj-hr-system",
    title: "HR & Operations Data Management System",
    slug: "response-team-hr-system",
    short_description: "Structured operational data and documentation workflow for BRAC University Response Team.",
    description: "Designed and managed structured operational data systems using Google Sheets and Google Workspace for the BRAC University Response Team. Maintained accurate member registries, tracked event logistics, scheduled shifts, and established standardized documentation protocols to ensure seamless HR operations and timely communications.",
    features: [
      "Structured member databases and operational records using Google Sheets",
      "Attendance tracking and dynamic shift management for volunteer response teams",
      "Standardized HR documentation templates and reporting workflows in Google Docs",
      "Enhanced team communication channels to meet operational deadlines reliably",
    ],
    technologies: ["Google Sheets", "Google Docs", "Data Management", "Operations Management", "Team Communication"],
    cover_image_url: null,
    github_url: "",
    live_url: "",
    year: 2024,
    featured: true,
    published: true,
    sort_order: 1,
  },
  {
    id: "proj-python-oop",
    title: "Python Object-Oriented Software Projects",
    slug: "python-oop-projects",
    short_description: "Modular software applications applying object-oriented design patterns and discrete mathematics in Python.",
    description: "Developed modular software applications applying object-oriented programming principles (encapsulation, inheritance, polymorphism, and abstraction) alongside discrete mathematical algorithms. Focused on clean code organization, data modeling, and algorithmic problem solving as part of the Computer Science & Engineering curriculum at BRAC University.",
    features: [
      "Object-oriented class hierarchies and modular architectural components",
      "Implementation of discrete mathematical concepts and algorithmic logic",
      "Robust input validation, structured test cases, and exception handling",
      "Emphasis on code reusability, maintainability, and clean architecture",
    ],
    technologies: ["Python", "OOP", "Discrete Mathematics", "Algorithms", "Data Structures"],
    cover_image_url: null,
    github_url: "",
    live_url: "",
    year: 2023,
    featured: true,
    published: true,
    sort_order: 2,
  },
  {
    id: "proj-web-seo",
    title: "Responsive CMS & SEO Web Development",
    slug: "responsive-web-seo-development",
    short_description: "Responsive website design, CMS deployment, and on-page search engine optimization.",
    description: "Designed and configured functional, mobile-friendly websites on WordPress and Squarespace. Implemented on-page search engine optimization (SEO) techniques, organized content hierarchies, optimized page loading speeds, and integrated marketing practices via Google Ads principles to drive discovery.",
    features: [
      "Fully responsive web layouts tailored for desktop, tablet, and mobile displays",
      "Search engine optimization (SEO) including meta descriptions, headings, and semantic hierarchy",
      "Intuitive navigation structure and content categorization",
      "Integration of digital marketing and Google Ads best practices",
    ],
    technologies: ["WordPress", "Squarespace", "SEO", "Web Design", "Google Ads"],
    cover_image_url: null,
    github_url: "",
    live_url: "",
    year: 2024,
    featured: true,
    published: true,
    sort_order: 3,
  },
];

export const DEFAULT_POSTER_DESIGNS: PosterDesign[] = [
  {
    id: "poster-genesis-sample",
    title: "Genesis Science Fest Poster",
    category: "Festival & Events",
    image_url: "/Picture/Social Media Poster Designs/BUNSC sample poster for Genesis.png",
    description: "Official promotional poster design for Genesis, the flagship science festival organized by BRAC University Natural Sciences Club.",
    sort_order: 0,
  },
  {
    id: "poster-monsoon-genesis",
    title: "Monsoon Genesis Science Festival",
    category: "Festival & Events",
    image_url: "/Picture/Social Media Poster Designs/nahid niaz- monsoon genesis .png",
    description: "Themed seasonal event branding and poster artwork for Monsoon Genesis at BRAC University.",
    sort_order: 1,
  },
  {
    id: "poster-monsoon-genesis-1",
    title: "Monsoon Genesis Campaign Edition",
    category: "Festival & Events",
    image_url: "/Picture/Social Media Poster Designs/nahid niaz- monsoon genesis 1.png",
    description: "High-resolution promotional campaign visual featuring custom color palettes and event schedules.",
    sort_order: 2,
  },
  {
    id: "poster-biotech",
    title: "BUNSC Biotechnology Day",
    category: "Academic & Tech",
    image_url: "/Picture/Social Media Poster Designs/BUNSC- BioTECH Day.png",
    description: "Science symposium and biotechnology awareness day poster crafted for university seminars and guest lectures.",
    sort_order: 3,
  },
  {
    id: "poster-covid-awareness",
    title: "BUNSC COVID-19 Awareness Campaign",
    category: "Social Awareness",
    image_url: "/Picture/Social Media Poster Designs/BUNSC - Covid awareness.png",
    description: "Public health and safety awareness campaign poster highlighting preventive protocols and university guidance.",
    sort_order: 4,
  },
  {
    id: "poster-uprising-1",
    title: "Student-People Uprising Day — Tribute 1",
    category: "Social Awareness",
    image_url: "/Picture/Social Media Poster Designs/Nahid Niaz - Student-People Uprising Day.png",
    description: "Commemorative visual artwork honoring the historic student-people uprising and youth movement in Bangladesh.",
    sort_order: 5,
  },
  {
    id: "poster-uprising-2",
    title: "Student-People Uprising Day — Tribute 2",
    category: "Social Awareness",
    image_url: "/Picture/Social Media Poster Designs/Nahid Niaz - Student-People Uprising Day2.png",
    description: "Alternative commemorative typography and visual tribute honoring student solidarity and resilience.",
    sort_order: 6,
  },
  {
    id: "poster-burt",
    title: "BURT Emergency Response Team Poster",
    category: "Club & Operations",
    image_url: "/Picture/Social Media Poster Designs/BURT poster design.jpg",
    description: "Operational awareness and recruitment poster created for BRAC University Response Team initiatives.",
    sort_order: 7,
  },
  {
    id: "poster-club-orientation",
    title: "Club Orientation Welcome Poster",
    category: "Club & Operations",
    image_url: "/Picture/Social Media Poster Designs/club orientation- Poster.png",
    description: "New member induction and orientation day welcome poster for club recruitment drives.",
    sort_order: 8,
  },
  {
    id: "poster-orientation-program",
    title: "University Orientation Program",
    category: "Club & Operations",
    image_url: "/Picture/Social Media Poster Designs/orientation program.jpg",
    description: "Campus orientation promotional poster welcoming incoming undergraduate students.",
    sort_order: 9,
  },
  {
    id: "poster-bupl-cricket",
    title: "NSC Cricket BUPL Tournament",
    category: "Sports & Tournaments",
    image_url: "/Picture/Social Media Poster Designs/NSC CRICKET BUPL.png",
    description: "Inter-club sports tournament promotional banner designed for the BRAC University Premier League cricket event.",
    sort_order: 10,
  },
  {
    id: "poster-jersey-design",
    title: "NSC Official Jersey & Apparel Design",
    category: "Merchandise & Print",
    image_url: "/Picture/Social Media Poster Designs/jersey nsc final.png",
    description: "Custom sports apparel design and official club jersey mockup produced for club members and sports teams.",
    sort_order: 11,
  },
  {
    id: "poster-notepad-panel",
    title: "Executive Panel Notepad & Stationery",
    category: "Merchandise & Print",
    image_url: "/Picture/Social Media Poster Designs/Note Pad - Panel.png",
    description: "Executive stationery and conference notepad print layout designed for club panel meetings.",
    sort_order: 12,
  },
  {
    id: "poster-social-tour",
    title: "Social Media Tour & Workshop",
    category: "Workshops & Outreach",
    image_url: "/Picture/Social Media Poster Designs/Social media tour poster.png",
    description: "Creative digital workshop and social media tour announcement poster for student content creators.",
    sort_order: 13,
  },
  {
    id: "poster-promo-sample",
    title: "Brand Promotion & Outreach Poster",
    category: "Workshops & Outreach",
    image_url: "/Picture/Social Media Poster Designs/sample promotion poster.png",
    description: "Multi-purpose promotional poster template designed for interactive club campaigns and outreach activities.",
    sort_order: 14,
  },
];

function isStaleDemoData(data: any): boolean {
  if (!data) return false;
  const str = JSON.stringify(data);
  return str.includes("Alex Morgan") || str.includes("alex.morgan@example.com");
}

async function single<T>(query: () => PromiseLike<{ data: any; error: any }>, fallback: T): Promise<T> {
  try {
    const { data, error } = await query();
    if (error || !data || isStaleDemoData(data)) return fallback;
    return (data as T) ?? fallback;
  } catch {
    return fallback;
  }
}

async function list<T>(query: () => PromiseLike<{ data: any; error: any }>, fallback: T[]): Promise<T[]> {
  try {
    const { data, error } = await query();
    if (error || !data || (Array.isArray(data) && data.length === 0) || isStaleDemoData(data)) return fallback;
    return (data as T[]) ?? fallback;
  } catch {
    return fallback;
  }
}

export const getProfile = () =>
  single<Profile>(() => supabase.from("profile").select("*").limit(1).maybeSingle(), DEFAULT_PROFILE);

export const getSettings = () =>
  single<SiteSettings>(() => supabase.from("site_settings").select("*").limit(1).maybeSingle(), DEFAULT_SETTINGS);

export const getSocialLinks = () =>
  list<SocialLink>(() => supabase.from("social_links").select("*").order("sort_order"), DEFAULT_SOCIAL_LINKS);

export const getEducation = () =>
  list<Education>(() => supabase.from("education").select("*").order("sort_order"), DEFAULT_EDUCATION);

export const getExperience = () =>
  list<Experience>(() => supabase.from("experience").select("*").order("sort_order"), DEFAULT_EXPERIENCE);

export const getSkills = () =>
  list<Skill>(() => supabase.from("skills").select("*").order("sort_order"), DEFAULT_SKILLS);

export const getCertifications = () =>
  list<Certification>(() => supabase.from("certifications").select("*").order("sort_order"), DEFAULT_CERTIFICATIONS);

export const getLanguages = () =>
  list<Language>(() => supabase.from("languages").select("*").order("sort_order"), DEFAULT_LANGUAGES);

export const getAwards = () =>
  list<Award>(() => supabase.from("awards").select("*").order("sort_order"), DEFAULT_AWARDS);

export const getProjects = async (publishedOnly = true) => {
  return list<Project>(() => {
    let q = supabase.from("projects").select("*").order("sort_order");
    if (publishedOnly) q = q.eq("published", true);
    return q;
  }, publishedOnly ? DEFAULT_PROJECTS.filter((p) => p.published) : DEFAULT_PROJECTS);
};

export const getProjectBySlug = async (slug: string) => {
  try {
    const res = await supabase.from("projects").select("*").eq("slug", slug).eq("published", true).maybeSingle();
    if (res.data && !isStaleDemoData(res.data)) return res.data as Project;
  } catch {
    // fallback to local default
  }
  return DEFAULT_PROJECTS.find((p) => p.slug === slug) ?? null;
};

export const getProjectImages = (projectId: string) =>
  list<ProjectImage>(() => supabase.from("project_images").select("*").eq("project_id", projectId).order("sort_order"), []);

export const getAchievements = () =>
  list<Achievement>(() => supabase.from("achievements").select("*").order("sort_order"), DEFAULT_ACHIEVEMENTS);

export const getPosterDesigns = () =>
  list<PosterDesign>(() => supabase.from("poster_designs" as any).select("*").order("sort_order"), DEFAULT_POSTER_DESIGNS);

export const getMessages = () =>
  list<Message>(() => supabase.from("messages").select("*").order("created_at", { ascending: false }), []);

export function formatDateRange(start: string | null, end: string | null): string {
  const fmt = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short" });
  if (!start && !end) return "";
  const s = start ? fmt(start) : "";
  const e = end ? fmt(end) : "Present";
  return `${s} — ${e}`;
}

export function formatDate(d: string | null): string {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}
