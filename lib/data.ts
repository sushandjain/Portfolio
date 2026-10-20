export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: string;
  date: string;
  status: "Live Production" | "Deployed App" | "Open Source" | "Client Project";
  featured: boolean;
  description: string;
  points: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  githubUrl?: string;
  previewGradient: string;
  badgeColor: string;
}

export const projects: Project[] = [
  {
    id: "malnad-direct",
    name: "Malnad Direct",
    tagline: "Western Ghats D2C Estate Harvest & Speed Post Logistics Platform",
    category: "Full-Stack D2C E-Commerce",
    date: "2026",
    status: "Live Production",
    featured: true,
    description:
      "A high-performance direct-to-consumer platform delivering single-origin estate coffee (Peaberry Arabica), orthodox mountain tea, and hand-picked Tellicherry spices directly from Kalasa, Karnataka across India.",
    points: [
      "Engineered real-time India Post Speed Post delivery calculator with 6-digit PIN code validation and SLA lookup.",
      "Integrated seamless Razorpay UPI and card payment flows with automated receipt generation and order tracking.",
      "Designed responsive mobile-first UI with estate altitude indicators (950m–1150m), bilingual toggle, and FSSAI compliance notices.",
      "Built dynamic shopping bag, harvest filter categorization, and an interactive AI Assistant for estate recommendations.",
    ],
    stack: ["Next.js", "React.js", "TypeScript", "Tailwind CSS", "Speed Post API", "Razorpay UPI", "Vercel"],
    metrics: [
      { label: "Origin Altitude", value: "950m–1150m" },
      { label: "Sub-Post Office", value: "PIN 577124" },
      { label: "Free Shipping", value: "₹750+ Nationwide" },
      { label: "Speed", value: "100% Mobile Ready" },
    ],
    liveUrl: "http://malnaddirect.vercel.app",
    previewGradient: "from-emerald-950 via-stone-900 to-amber-950",
    badgeColor: "#10B981",
  },
  {
    id: "tunexia",
    name: "Tunexia",
    tagline: "High-Performance Cloud Music Streaming & Audio Management Platform",
    category: "Cloud Media & REST Platform",
    date: "Dec 2025",
    status: "Live Production",
    featured: true,
    description:
      "A full-stack progressive music streaming platform offering instant playback, custom playlist creation, role-based admin controls, and cloud media orchestration.",
    points: [
      "Engineered 12+ RESTful APIs handling authentication, track lifecycle CRUD, playlist operations, and user profiles.",
      "Implemented secure JWT authentication with strict role-based access control (Admin & User accounts).",
      "Integrated Cloudinary and Multer for resilient cloud storage and streaming optimization of audio and album artwork.",
      "Engineered progressive audio streaming with zero-lag real-time playback bar, volume sliders, and responsive React/Tailwind UI.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Cloudinary", "JWT", "Tailwind CSS"],
    metrics: [
      { label: "REST APIs", value: "12+ Endpoints" },
      { label: "Auth", value: "JWT Role-Based" },
      { label: "Media Engine", value: "Cloudinary + Multer" },
      { label: "Streaming", value: "Progressive Chunks" },
    ],
    liveUrl: "https://tunexia-music.vercel.app", // Live / portfolio link
    githubUrl: "https://github.com/sushandjain",
    previewGradient: "from-indigo-950 via-purple-950 to-slate-900",
    badgeColor: "#6366F1",
  },
  {
    id: "explore",
    name: "Explore",
    tagline: "Commercial Tour Booking & Freight Fleet Logistics Platform",
    category: "Full-Stack Logistics & Booking",
    date: "Feb 2026",
    status: "Live Production",
    featured: true,
    description:
      "A commercial logistics and trekking booking solution engineered for a regional operator, allowing customers to explore guided routes, quote freight services, and book online.",
    points: [
      "Built and deployed responsive React.js interfaces connected to Node.js and Express REST services.",
      "Engineered multi-tier booking forms, calendar slot reservation, and instant dispatch request workflows.",
      "Optimized for high-conversion mobile visitors with touch-friendly controls and fluid layout transitions.",
      "Integrated automated email/SMS booking confirmations and real-time fleet availability status.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "Tailwind CSS", "RESTful APIs", "Render"],
    metrics: [
      { label: "Platform", value: "Trucking & Trekking" },
      { label: "Architecture", value: "Node REST API" },
      { label: "Device Support", value: "Desktop & Mobile" },
      { label: "Deployment", value: "Render + Vercel" },
    ],
    liveUrl: "https://explore-booking.vercel.app",
    githubUrl: "https://github.com/sushandjain",
    previewGradient: "from-amber-950 via-stone-900 to-orange-950",
    badgeColor: "#F59E0B",
  },
  {
    id: "kheti-bazaar",
    name: "Kheti Bazaar",
    tagline: "Direct Agri-Commerce Marketplace & Direct Farmer Communication Hub",
    category: "Agri-Tech & Marketplace",
    date: "Nov 2024",
    status: "Open Source",
    featured: false,
    description:
      "An agricultural e-marketplace bridging regional farmers directly with commercial buyers, eliminating predatory middlemen through transparent pricing and direct contact channels.",
    points: [
      "Built secure multi-role dashboard for farmers, wholesale buyers, and regional market administrators.",
      "Implemented location-based crop & produce discovery filtering by proximity and harvest freshness.",
      "Integrated WhatsApp deep links enabling direct buyer-seller instant messaging and pricing negotiation.",
      "Developed high-integrity relational SQL database schemas for produce listings, buyer inquiries, and order audit trails.",
    ],
    stack: ["Node.js", "Express.js", "SQL", "JavaScript", "HTML5", "CSS3", "WhatsApp API"],
    metrics: [
      { label: "Target", value: "Zero Middlemen" },
      { label: "Contact", value: "WhatsApp Deep Links" },
      { label: "Database", value: "Relational SQL" },
      { label: "Location", value: "Proximity Filters" },
    ],
    githubUrl: "https://github.com/sushandjain",
    previewGradient: "from-emerald-950 via-teal-950 to-slate-900",
    badgeColor: "#10B981",
  },
];

export const experience = [
  {
    role: "Systems Engineer",
    company: "Tata Consultancy Services (TCS)",
    location: "Bengaluru, India",
    period: "March 2026 – Present",
    status: "Current Role",
    summary:
      "Working on enterprise applications and high-throughput REST APIs, maintaining application reliability and supporting enterprise workflows in large-scale production environments.",
    highlights: [
      "Analyze high-frequency API requests and responses, troubleshoot complex application integration issues, and resolve technical latency bottlenecks.",
      "Collaborate across cross-functional engineering teams to conduct incident root-cause analysis (RCA) and ensure 99.9% application uptime.",
      "Adhere to structured enterprise ITIL processes for production deployments, system monitoring, alert triaging, and disaster recovery.",
      "Leverage automation scripts and log analysis tools to isolate edge-case failures across distributed enterprise architectures.",
    ],
    tags: ["REST APIs", "Enterprise Systems", "Troubleshooting", "Root-Cause Analysis (RCA)", "API Integrations", "Incident Management"],
  },
];

export const achievements = [
  {
    title: "2nd Place — TCS AI-Friday Hackathon",
    issuer: "Tata Consultancy Services",
    date: "2026",
    description:
      "Engineered an AI-driven solution that parses unstructured business requirements and automatically converts them into structured, actionable engineering data insights and system specs.",
    icon: "trophy",
    badge: "Hackathon Winner",
  },
  {
    title: "Runner-Up — National Level Coding Competition",
    issuer: "SDIT, Mangalore",
    date: "National Contest",
    description:
      "Recognized for superior algorithmic problem-solving speed, clean system design, and competitive coding under rigorous time constraints.",
    icon: "award",
    badge: "National Finalist",
  },
];

export const education = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Vivekananda College of Arts, Science & Commerce (Autonomous)",
    location: "Puttur, Karnataka",
    period: "2022 – 2025",
    grade: "CGPA: 8.92 / 10",
    description: "Core coursework in Data Structures, Object-Oriented Programming, Database Management Systems, Computer Networks, and Software Engineering.",
  },
  {
    degree: "MERN Full Stack Development Training Program",
    institution: "JSpiders (Q/JSpider) Hebbal",
    location: "Bengaluru, Karnataka",
    period: "July 2025 – Feb 2026",
    grade: "Full Stack Certification",
    description: "Intensive training in modern JavaScript (ES6+), React.js, Node.js, Express.js, MongoDB, RESTful API architecture, and production deployment.",
  },
  {
    degree: "Master of Computer Applications (MCA)",
    institution: "Manipal University Jaipur (MUJ)",
    location: "Online / Distance Mode",
    period: "Expected 2027",
    grade: "In Progress",
    description: "Advanced study in Cloud Computing, Distributed Systems, Enterprise Software Architecture, and AI/ML applications.",
  },
];

export interface SkillGroup {
  category: string;
  items: { name: string; level: string; icon?: string }[];
}

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    items: [
      { name: "JavaScript (ES6+)", level: "Advanced" },
      { name: "TypeScript", level: "Advanced" },
      { name: "Python", level: "Intermediate" },
      { name: "SQL", level: "Proficient" },
    ],
  },
  {
    category: "Frontend",
    items: [
      { name: "React.js", level: "Expert" },
      { name: "Next.js", level: "Advanced" },
      { name: "Angular", level: "Proficient" },
      { name: "Tailwind CSS", level: "Expert" },
      { name: "HTML5 / CSS3", level: "Expert" },
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      { name: "Node.js", level: "Advanced" },
      { name: "Express.js", level: "Advanced" },
      { name: "RESTful APIs", level: "Expert" },
      { name: "JWT Authentication", level: "Advanced" },
      { name: "Multer & Cloudinary", level: "Proficient" },
    ],
  },
  {
    category: "Databases",
    items: [
      { name: "MongoDB", level: "Advanced" },
      { name: "SQL / MySQL", level: "Proficient" },
      { name: "Mongoose ODM", level: "Advanced" },
    ],
  },
  {
    category: "Tools & Deployment",
    items: [
      { name: "Git & GitHub", level: "Advanced" },
      { name: "Postman", level: "Expert" },
      { name: "Vercel", level: "Advanced" },
      { name: "Render", level: "Proficient" },
      { name: "Netlify", level: "Proficient" },
    ],
  },
];

export const personalInfo = {
  name: "Sushan D Jain",
  shortName: "Sushan Jain",
  initials: "SJ",
  title: "Full-Stack Developer & Systems Engineer",
  tagline: "Crafting resilient full-stack web applications and robust enterprise API systems.",
  location: "Bengaluru, India",
  timezone: "Asia/Kolkata",
  phone: "+91 80881 55097",
  email: "sushandjain@gmail.com",
  linkedin: "https://linkedin.com/in/sushandjain121",
  github: "https://github.com/sushandjain",
  status: "Available for high-impact opportunities",
};
