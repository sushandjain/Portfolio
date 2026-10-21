/**
 * SHOWCASE DATA CONFIGURATION
 * 
 * Replace or customize the 3 projects below.
 * Each project contains:
 * - id, slug, title, subtitle
 * - intro block: short description, role, year, tools, client
 * - 7 images: url, alt, caption, tag
 */

export interface ShowcaseImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  tag?: string;
  aspect?: string;
}

export interface ShowcaseProject {
  id: string;
  index: string; // e.g. "01"
  title: string;
  tagline: string;
  description: string;
  role: string;
  year: string;
  tools: string[];
  client: string;
  accentColor: string;
  galleryVariant: "horizontal" | "stacked" | "bento";
  images: ShowcaseImage[];
  liveUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
}

export const showcaseProjects: ShowcaseProject[] = [
  /* =========================================================================
     PROJECT 1: PINNED HORIZONTAL GALLERY (e.g., Malnad Direct / E-Commerce)
     ========================================================================= */
  {
    id: "project-1",
    index: "01",
    title: "MALNAD DIRECT",
    tagline: "Western Ghats D2C Estate Harvest & Speed Post Logistics",
    description:
      "A high-throughput direct-to-consumer platform delivering single-origin estate coffee, orthodox teas, and rare spices directly from Kalasa to doorsteps nationwide.",
    role: "Lead Full-Stack Architect",
    year: "2026",
    tools: ["Next.js 15", "React", "TypeScript", "Tailwind CSS", "Speed Post API", "Razorpay"],
    client: "Western Ghats Harvest Collective",
    accentColor: "#10B981",
    galleryVariant: "horizontal",
    liveUrl: "http://malnaddirect.vercel.app/",
    githubUrl: "https://github.com/sushandjain",
    videoUrl: "/malnaddirect/malnadintro.mp4",
    images: [
      {
        id: "p1-img-1",
        url: "/malnaddirect/screenshot_1.png",
        alt: "Malnad Direct - Storefront Hero and Single-Origin Harvest Overview",
        caption: "Single-origin estate harvest showcase with altitude indicators (950m–1150m)",
        tag: "STOREFRONT HERO",
      },
      {
        id: "p1-img-2",
        url: "/malnaddirect/screenshot_2.png",
        alt: "Malnad Direct - India Post Speed Post SLA Delivery Calculator",
        caption: "Real-time PIN code validation and dynamic transit SLA lookup engine",
        tag: "LOGISTICS ENGINE",
      },
      {
        id: "p1-img-3",
        url: "/malnaddirect/screenshot_3.png",
        alt: "Malnad Direct - Direct Estate Coffee & Orthodox Tea Catalog",
        caption: "Interactive harvest filters by elevation, roast profile, and terroir",
        tag: "PRODUCT CATALOG",
      },
      {
        id: "p1-img-4",
        url: "/malnaddirect/screenshot_4.png",
        alt: "Malnad Direct - Streamlined Razorpay Checkout & Bag Drawer",
        caption: "Frictionless mobile UPI checkout drawer with instant receipt generation",
        tag: "CHECKOUT DRAWER",
      },
      {
        id: "p1-img-5",
        url: "/malnaddirect/screenshot_5.png",
        alt: "Malnad Direct - Samse Valley Heritage and Farmgate Traceability",
        caption: "Transparent smallholder farm traceability and sustainable jute packaging",
        tag: "ESTATE HERITAGE",
      },
      {
        id: "p1-img-6",
        url: "/malnaddirect/screenshot_6.png",
        alt: "Malnad Direct - Bilingual English and Kannada Interface Toggle",
        caption: "Localized dialect accessibility connecting growers with national consumers",
        tag: "BILINGUAL UI",
      },
      {
        id: "p1-img-7",
        url: "/malnaddirect/screenshot_7.png",
        alt: "Malnad Direct - Speed Post Barcode Tracking and Customer Reviews",
        caption: "S10 13-digit barcode consignment tracking and customer reviews",
        tag: "POSTAL TRACKING",
      },
    ],
  },

  /* =========================================================================
     PROJECT 2: STICKY STACKED CARDS (e.g., TuneXIA / Cloud Music Streaming)
     ========================================================================= */
  {
    id: "project-2",
    index: "02",
    title: "TUNEXIA CLOUD",
    tagline: "High-Performance Progressive Music Streaming & CDN Platform",
    description:
      "A cloud-native progressive audio streaming engine built for instant byte-range playback, dynamic playlist orchestration, and strict role-based access control.",
    role: "Systems Engineer & Backend Architect",
    year: "2025",
    tools: ["React", "Node.js", "Express", "MongoDB", "Cloudinary CDN", "JWT", "Tailwind CSS"],
    client: "SoundStream Media Group",
    accentColor: "#6366F1",
    galleryVariant: "stacked",
    liveUrl: "https://tunexia.vercel.app/",
    githubUrl: "https://github.com/sushandjain",
    videoUrl: "/tunexia/tunexia-intro.mp4",
    images: [
      {
        id: "p2-img-1",
        url: "/tunexia/screenshot_1.png",
        alt: "TuneXIA - Progressive Chunked Audio Player and Visualizer",
        caption: "Zero-lag progressive chunked streaming engine with real-time waveform buffer",
        tag: "AUDIO PLAYER",
      },
      {
        id: "p2-img-2",
        url: "/tunexia/screenshot_2.png",
        alt: "TuneXIA - Authenticated User Library and Personal Playlists",
        caption: "Encrypted JWT session authentication with private collections and favorites",
        tag: "USER LIBRARY",
      },
      {
        id: "p2-img-3",
        url: "/tunexia/screenshot_3.png",
        alt: "TuneXIA - Cloudinary CDN Media Delivery Infrastructure",
        caption: "Lossless 320kbps audio buffer delivery optimized for under 30ms latency",
        tag: "CDN ENGINE",
      },
      {
        id: "p2-img-4",
        url: "/tunexia/screenshot_4.png",
        alt: "TuneXIA - Drag-and-Drop Playlist Curation and Track Search",
        caption: "Dynamic playlist orchestration with instant fuzzy search and reordering",
        tag: "PLAYLIST BUILDER",
      },
      {
        id: "p2-img-5",
        url: "/tunexia/screenshot_5.png",
        alt: "TuneXIA - High-Fidelity Audio Bitrate and Attenuator Controls",
        caption: "Adaptive bitrate selector and high-fidelity output tuning controls",
        tag: "EQUALIZER PRESETS",
      },
      {
        id: "p2-img-6",
        url: "/tunexia/screenshot_6.png",
        alt: "TuneXIA - Admin Ingestion Portal and Media Telemetry",
        caption: "Role-gated administrative console for audio ingestion and stream health telemetry",
        tag: "ADMIN TELEMETRY",
      },
      {
        id: "p2-img-7",
        url: "/tunexia/screenshot_7.png",
        alt: "TuneXIA - Responsive Mobile Layout and Offline Audio Queue",
        caption: "Touch-optimized mobile player with persistent background playback",
        tag: "MOBILE INTERFACE",
      },
    ],
  },

  /* =========================================================================
     PROJECT 3: ASYMMETRIC BENTO GRID + LIGHTBOX (e.g., Henjodi Stores)
     ========================================================================= */
  {
    id: "project-3",
    index: "03",
    title: "HENJODI EXPEDITIONS",
    tagline: "Western Ghats Trekking Logistics & Adventure Booking Portal",
    description:
      "An adventure booking and mountain logistics gateway for Kudremukh, Netravati, and Kurinjal peaks, integrating government permits, guide quotas, and homestay dispatch.",
    role: "Full-Stack Web & GIS Developer",
    year: "2026",
    tools: ["JavaScript", "HTML5", "CSS3", "WhatsApp Business API", "Google Maps API", "Netlify"],
    client: "Henjodi Stores, Balagal",
    accentColor: "#F59E0B",
    galleryVariant: "bento",
    liveUrl: "https://henjodistores.netlify.app/",
    githubUrl: "https://github.com/sushandjain",
    videoUrl: "/henjodi/henjodiintro.mp4",
    images: [
      {
        id: "p3-img-1",
        url: "/henjodi/Henjodi-Stores-01-Landing.png",
        alt: "Henjodi Stores - Official Western Ghats Expedition Portal",
        caption: "Official gateway for Kudremukh Peak and Balagal base camp expeditions",
        tag: "EXPEDITION PORTAL",
      },
      {
        id: "p3-img-2",
        url: "/henjodi/Henjodi-Stores-02-Trek-Options.png",
        alt: "Henjodi Stores - Multi-Peak Packages and Altitude Topography",
        caption: "Itinerary selectors for Kudremukh (1894m), Netravati, and Kurinjal peaks",
        tag: "PEAK SELECTOR",
      },
      {
        id: "p3-img-3",
        url: "/henjodi/Henjodi-Stores-03-Planning-Overview.png",
        alt: "Henjodi Stores - Forest Department Permit Verification and Guide Allocation",
        caption: "Automated government permit allocation and certified mountain guide dispatch",
        tag: "FOREST PERMITS",
      },
      {
        id: "p3-img-4",
        url: "/henjodi/Henjodi-Stores-04-Peak-Listings.png",
        alt: "Henjodi Stores - Mountain Homestay Accommodations and Traditional Food",
        caption: "Balagal hub logistics, traditional Malnad cuisine, and mountain gear supplies",
        tag: "HOMESTAYS & HUB",
      },
      {
        id: "p3-img-5",
        url: "/henjodi/Henjodi-Stores-05-Kudremukh-Trek.png",
        alt: "Henjodi Stores - 22km High-Altitude Kudremukh Trail Guide",
        caption: "Trailhead gradient map, water-point locations, and forest checkpost SLA rules",
        tag: "TRAIL TOPOGRAPHY",
      },
      {
        id: "p3-img-6",
        url: "/henjodi/Henjodi-Stores-06-Plan-Your-Trek.png",
        alt: "Henjodi Stores - WhatsApp Booking Handshake and Packing Checklist",
        caption: "Real-time WhatsApp dispatch integration with automated gear checklist",
        tag: "WHATSAPP DISPATCH",
      },
      {
        id: "p3-img-7",
        url: "/henjodi/Henjodi-Stores-07-Trailhead-Map.png",
        alt: "Henjodi Stores - GPS Trailhead Navigation and Balagal Hub Map",
        caption: "GPS navigation coordinates (13.184369° N, 75.319509° E) for base camp",
        tag: "GPS NAVIGATION",
      },
    ],
  },
];
