export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: string;
  date: string;
  status: "Live Production" | "Deployed App" | "Open Source" | "Commercial Client";
  featured: boolean;
  description: string;
  points: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  githubUrl?: string;
  previewGradient: string;
  badgeColor: string;
  previewImage?: string;
  accentHex: string;
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
      "A high-performance direct-to-consumer platform delivering single-origin estate coffee (Peaberry Arabica), orthodox mountain tea, and wild forest spices directly from Kalasa (Western Ghats), Karnataka to doorsteps across India.",
    points: [
      "Engineered real-time India Post Speed Post delivery calculator with 6-digit PIN code validation and SLA lookup.",
      "Integrated seamless Razorpay UPI and card payment flows with automated receipt generation and order tracking.",
      "Designed responsive mobile-first UI with estate altitude indicators (950m–1150m), bilingual toggle (EN/KN), and FSSAI compliance notices.",
      "Built dynamic shopping bag, harvest filter categorization, and an interactive AI Assistant for estate recommendations.",
    ],
    stack: ["Next.js 15", "React.js", "TypeScript", "Tailwind CSS", "Speed Post API", "Razorpay UPI", "Vercel"],
    metrics: [
      { label: "Origin Altitude", value: "950m–1150m" },
      { label: "Sub-Post Office", value: "PIN 577124" },
      { label: "Free Shipping", value: "₹750+ Nationwide" },
      { label: "Delivery", value: "Speed Post Direct" },
    ],
    liveUrl: "http://malnaddirect.vercel.app/",
    githubUrl: "https://github.com/sushandjain",
    previewGradient: "from-emerald-950 via-stone-900 to-amber-950",
    badgeColor: "#10B981",
    accentHex: "#10B981",
  },
  {
    id: "tunexia",
    name: "TuneXIA",
    tagline: "High-Performance Cloud Music Streaming & Progressive Audio Engine",
    category: "Cloud Media & REST Platform",
    date: "Dec 2025",
    status: "Live Production",
    featured: true,
    description:
      "A fast, mobile-first progressive music streaming web application offering instant playback, custom playlist orchestration, role-based admin controls, and cloud media delivery.",
    points: [
      "Engineered 12+ RESTful APIs handling authentication, track lifecycle CRUD, playlist operations, and user profiles.",
      "Implemented secure JWT authentication with strict role-based access control (Admin & User accounts).",
      "Integrated Cloudinary and Multer for resilient cloud storage and streaming optimization of audio and album artwork.",
      "Engineered progressive chunked audio streaming with zero-lag real-time playback bar, volume sliders, and responsive UI.",
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Cloudinary CDN", "JWT", "Tailwind CSS"],
    metrics: [
      { label: "REST APIs", value: "12+ Endpoints" },
      { label: "Auth", value: "JWT Role-Based" },
      { label: "Media Engine", value: "Cloudinary CDN" },
      { label: "Streaming", value: "Progressive Chunks" },
    ],
    liveUrl: "https://tunexia.vercel.app/",
    githubUrl: "https://github.com/sushandjain",
    previewGradient: "from-indigo-950 via-purple-950 to-slate-900",
    badgeColor: "#6366F1",
    accentHex: "#6366F1",
  },
  {
    id: "henjodi-stores",
    name: "Henjodi Stores",
    tagline: "Western Ghats Trekking Booking & Logistics Tourism Platform",
    category: "Commercial Trekking & Logistics",
    date: "Feb 2026",
    status: "Live Production",
    featured: true,
    description:
      "Official digital booking and expedition platform for Henjodi Stores in Balagal, Kalasa. Facilitates Kudremukh, Netravati Peak, Kurinjal, and Ballalarayana Durga trek bookings, forest permits, local guides, and homestays.",
    points: [
      "Built and deployed live production portal connecting adventure tourists with official Western Ghats forest guides and local homestays.",
      "Integrated live WhatsApp deep-link booking dispatch (+91 80731 78851) and Google Maps GPS navigation for the Henjodi Store hub.",
      "Engineered multi-peak itinerary selectors, trek package pricing calculators, and essential packing checklists.",
      "Optimized for high-speed offline-first mobile visitors traveling through remote mountain regions with poor connectivity.",
    ],
    stack: ["JavaScript", "HTML5", "CSS3", "WhatsApp Business API", "Google Maps API", "Netlify"],
    metrics: [
      { label: "Trek Routes", value: "Kudremukh & Netravati" },
      { label: "Dispatch", value: "Balagal, Kalasa" },
      { label: "Bookings", value: "Direct WhatsApp Flow" },
      { label: "Availability", value: "24/7 Mountain Ops" },
    ],
    liveUrl: "https://henjodistores.netlify.app/",
    githubUrl: "https://github.com/sushandjain",
    previewGradient: "from-amber-950 via-stone-900 to-orange-950",
    badgeColor: "#F59E0B",
    accentHex: "#F59E0B",
  },
  {
    id: "kheti-bazaar",
    name: "Kheti Bazaar",
    tagline: "Direct Agri-Commerce Marketplace & Produce Negotiation Hub",
    category: "Agri-Tech & Marketplace",
    date: "Nov 2024",
    status: "Open Source",
    featured: false,
    description:
      "An agricultural e-marketplace bridging regional farmers directly with commercial wholesale buyers, eliminating predatory middlemen through transparent pricing and direct WhatsApp communication.",
    points: [
      "Built secure multi-role dashboard for farmers, wholesale buyers, and regional market administrators.",
      "Implemented location-based crop & produce discovery filtering by proximity and harvest freshness.",
      "Integrated WhatsApp deep links enabling direct buyer-seller instant messaging and real-time pricing negotiation.",
      "Developed high-integrity relational SQL database schemas for produce listings, buyer inquiries, and order audit trails.",
    ],
    stack: ["Node.js", "Express.js", "SQL", "JavaScript", "HTML5", "CSS3", "WhatsApp API"],
    metrics: [
      { label: "Market Target", value: "Zero Middlemen" },
      { label: "Negotiation", value: "WhatsApp Deep Links" },
      { label: "Database", value: "Relational SQL" },
      { label: "Source Code", value: "Verified on GitHub" },
    ],
    liveUrl: "https://github.com/sushandjain/Kheti-baazaar",
    githubUrl: "https://github.com/sushandjain/Kheti-baazaar",
    previewGradient: "from-emerald-950 via-teal-950 to-slate-900",
    badgeColor: "#10B981",
    accentHex: "#10B981",
  },
];

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  badge: string;
  driveUrl: string;
  description: string;
  skillsVerified: string[];
}

export const certificates: Certificate[] = [
  {
    id: "tcs-ai-friday",
    title: "2nd Place — TCS AI-Friday Hackathon",
    issuer: "Tata Consultancy Services (TCS)",
    date: "2026",
    badge: "Hackathon Winner",
    driveUrl: "https://drive.google.com/file/d/1YRILSJmNRNpKXfT4Fdv1w9ffTBiSL6Z9/view?usp=drivesdk",
    description:
      "Awarded 2nd Place across TCS for engineering an AI-driven solution that parses unstructured business requirements and converts them into structured engineering data insights.",
    skillsVerified: ["GenAI Requirement Analysis", "Enterprise AI Workflows", "Prompt Engineering", "Full-Stack AI Integration"],
  },
  {
    id: "jspiders-mern",
    title: "MERN Full Stack Development Training",
    issuer: "JSpiders (Q/JSpider) Hebbal, Bengaluru",
    date: "July 2025 – Feb 2026",
    badge: "Full Stack Mastery",
    driveUrl: "https://drive.google.com/file/d/1KqbAk37MIZkDtMHSjcaNrMSw0QUferVj/view?usp=drivesdk",
    description:
      "Intensive practical immersion in modern full-stack development, covering React.js, Node.js, Express.js, MongoDB, RESTful API design, and production deployment.",
    skillsVerified: ["React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "JWT Security"],
  },
  {
    id: "simplilearn-java",
    title: "Core Java & Object-Oriented Engineering",
    issuer: "Simplilearn",
    date: "Verified Certification",
    badge: "Software Engineering",
    driveUrl: "https://drive.google.com/file/d/1ksiVDyCe9QXVDywDo_gIdAnTULg-rp60/view?usp=drivesdk",
    description:
      "Comprehensive certification in Core Java, Object-Oriented Programming (OOP) paradigms, multithreading, collections framework, and algorithm design.",
    skillsVerified: ["Java OOP", "Data Structures", "Collections Framework", "Exception Handling", "Multithreading"],
  },
  {
    id: "udemy-web-dev",
    title: "The Complete Web Development Bootcamp",
    issuer: "Udemy Professional Certification",
    date: "Verified Credential",
    badge: "Full-Stack Bootcamp",
    driveUrl: "https://drive.google.com/file/d/1Zw8USpKkls4v1sfmCP1baazJ0SpYm-x_/view?usp=drivesdk",
    description:
      "Comprehensive full-stack engineering certification spanning frontend interfaces, backend servers, SQL & NoSQL databases, security, and cloud hosting.",
    skillsVerified: ["Full-Stack Web Dev", "TypeScript", "Database Architecture", "REST APIs", "Modern CSS"],
  },
];

export const experience = [
  {
    role: "Systems Engineer",
    company: "Tata Consultancy Services (TCS)",
    location: "Bengaluru, India",
    period: "March 2026 – Present",
    status: "Current Enterprise Role",
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

export const education = [
  {
    degree: "Bachelor of Computer Applications (BCA)",
    institution: "Vivekananda College of Arts, Science & Commerce (Autonomous)",
    location: "Puttur, Karnataka",
    period: "2022 – 2025",
    grade: "CGPA: 8.92 / 10",
    description:
      "Graduated with High Distinction. Coursework in Data Structures & Algorithms, DBMS, Object-Oriented Software Design, Computer Networks, and Operating Systems.",
  },
  {
    degree: "MERN Full Stack Development Training Program",
    institution: "JSpiders (Q/JSpider) Hebbal",
    location: "Bengaluru, Karnataka",
    period: "July 2025 – Feb 2026",
    grade: "Full Stack Certification",
    description:
      "Professional hands-on immersion in building production-grade web platforms with React, Node, Express, MongoDB, and AWS/Cloud deployments.",
  },
  {
    degree: "Master of Computer Applications (MCA)",
    institution: "Manipal University Jaipur (MUJ)",
    location: "Online / Distance Mode",
    period: "Expected 2027",
    grade: "In Progress",
    description:
      "Advanced postgraduate study in Cloud Computing, Distributed Database Architecture, Enterprise Software Engineering, and AI/ML Systems.",
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
    driveUrl: "https://drive.google.com/file/d/1YRILSJmNRNpKXfT4Fdv1w9ffTBiSL6Z9/view?usp=drivesdk",
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
      { name: "Java", level: "Proficient" },
      { name: "Python", level: "Intermediate" },
      { name: "SQL", level: "Proficient" },
    ],
  },
  {
    category: "Frontend",
    items: [
      { name: "React.js", level: "Expert" },
      { name: "Next.js 15", level: "Advanced" },
      { name: "Tailwind CSS", level: "Expert" },
      { name: "HTML5 / CSS3", level: "Expert" },
      { name: "Angular", level: "Proficient" },
    ],
  },
  {
    category: "Backend & APIs",
    items: [
      { name: "Node.js", level: "Advanced" },
      { name: "Express.js", level: "Advanced" },
      { name: "RESTful APIs", level: "Expert" },
      { name: "JWT Authentication", level: "Advanced" },
      { name: "Cloudinary CDN", level: "Proficient" },
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
      { name: "Netlify", level: "Proficient" },
      { name: "Render", level: "Proficient" },
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
  linkedin: "https://www.linkedin.com/in/sushandjain121/",
  github: "https://github.com/sushandjain",
  status: "Available for high-impact opportunities",
};
