import fs from "fs";
import path from "path";
import { personalInfo, projects, certificates, experience, education, achievements, skillGroups } from "../data";
import { showcaseProjects } from "@/components/showcase/showcaseData";

const DATA_DIR = path.join(process.cwd(), "data");
const AUTH_FILE = path.join(DATA_DIR, "auth.json");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

export interface StoredProfile {
  name: string;
  shortName: string;
  initials: string;
  title: string;
  rotatingTitles: string[];
  tagline: string;
  bio: string;
  yearsOfExperience: string;
  location: string;
  timezone: string;
  coordinates: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  whatsapp: string;
  status: string;
  isOpenToWork: boolean;
  avatarUrl: string;
  resumeUrl: string;
  resumeFileName: string;
  resumeUpdatedAt: string;
  heroStretchPreset: string;
}

export interface StoredProject {
  id: string;
  slug?: string;
  name: string;
  tagline: string;
  category: string;
  date: string;
  status: string;
  featured: boolean;
  order: number;
  published: boolean;
  description: string;
  points: string[];
  stack: string[];
  metrics: { label: string; value: string }[];
  liveUrl?: string;
  githubUrl?: string;
  previewGradient: string;
  badgeColor: string;
  previewImage?: string;
  videoUrl?: string;
  accentHex: string;
  screenshots: { url: string; title: string; caption: string }[];
  showcaseRole?: string;
  showcaseYear?: string;
  showcaseClient?: string;
  galleryVariant?: "horizontal" | "stacked" | "bento";
}

export interface StoredExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  status: string;
  summary: string;
  highlights: string[];
  tags: string[];
  order: number;
  published: boolean;
  companyLogo?: string;
}

export interface StoredEducation {
  id: string;
  degree: string;
  institution: string;
  location: string;
  period: string;
  grade: string;
  description: string;
  order: number;
  published: boolean;
}

export interface StoredSkillGroup {
  id: string;
  category: string;
  order: number;
  published: boolean;
  items: { name: string; level: string; icon?: string }[];
}

export interface StoredCertificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  badge: string;
  credlyUrl?: string;
  credlyBadgeId?: string;
  badgeImage?: string;
  driveUrl?: string;
  accentColor?: string;
  isFeatured?: boolean;
  description: string;
  skillsVerified: string[];
  order: number;
  published: boolean;
}

export interface StoredAchievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  icon?: string;
  badge?: string;
  badgeImage?: string;
  credlyUrl?: string;
  driveUrl?: string;
  order: number;
  published: boolean;
}

export interface StoredSiteSettings {
  pageTitle: string;
  metaDescription: string;
  ogImageUrl: string;
  googleAnalyticsId: string;
  accentColor: string;
  footerText: string;
  sectionsVisibility: {
    hero: boolean;
    work: boolean;
    experience: boolean;
    credentials: boolean;
    arsenal: boolean;
    contact: boolean;
  };
}

export interface StoredContent {
  profile: StoredProfile;
  projects: StoredProject[];
  experience: StoredExperience[];
  education: StoredEducation[];
  skills: StoredSkillGroup[];
  certificates: StoredCertificate[];
  achievements: StoredAchievement[];
  settings: StoredSiteSettings;
  lastUpdatedAt: string;
}

export interface StoredMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  createdAt: string;
  read: boolean;
  starred: boolean;
}

export interface StoredAuth {
  adminEmail: string;
  passwordHash: string;
  failedAttempts: number;
  lockUntil: number | null;
  lastLogin: string | null;
  resetToken?: string | null;
  resetExpires?: number | null;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Atomic file write to prevent corrupted files on unexpected interrupts
function writeAtomicJson(filePath: string, data: any) {
  ensureDataDir();
  const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 6)}`;
  fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tempPath, filePath);
}

// Read JSON with safe fallback
function readJson<T>(filePath: string, fallback: T): T {
  try {
    ensureDataDir();
    if (!fs.existsSync(filePath)) {
      return fallback;
    }
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Failed to read JSON from ${filePath}:`, error);
    return fallback;
  }
}

/**
 * Build default content from hardcoded files
 */
export function getDefaultContent(): StoredContent {
  return {
    profile: {
      name: personalInfo.name,
      shortName: personalInfo.shortName,
      initials: personalInfo.initials,
      title: personalInfo.title,
      rotatingTitles: [
        "Full-Stack Architect",
        "Systems Engineer @ TCS",
        "Anthropic Claude Certified Associate",
        "REST API & Cloud Specialist",
      ],
      tagline: personalInfo.tagline,
      bio: "Systems Engineer at TCS & Full-Stack Architect crafting high-throughput REST APIs, progressive streaming engines, and resilient e-commerce platforms.",
      yearsOfExperience: "2+",
      location: personalInfo.location,
      timezone: personalInfo.timezone,
      coordinates: "12.9716° N, 77.5946° E",
      phone: personalInfo.phone,
      email: personalInfo.email,
      linkedin: personalInfo.linkedin,
      github: personalInfo.github,
      whatsapp: "https://wa.me/918088155097?text=Hi%20Sushan%2C%20reviewed%20your%20portfolio",
      status: personalInfo.status,
      isOpenToWork: true,
      avatarUrl: "/sushan.jpg",
      resumeUrl: "/media_1792777986693.pdf",
      resumeFileName: "SUSHAN_D_JAIN_RESUME.pdf",
      resumeUpdatedAt: "2026-10-23",
      heroStretchPreset: "wave",
    },
    projects: projects.map((p, index) => {
      // Find matching showcase project if available
      const sc = showcaseProjects.find((s) => s.title.toLowerCase().includes(p.name.toLowerCase()));
      return {
        ...p,
        order: index + 1,
        published: true,
        showcaseRole: sc?.role || "Lead Architect",
        showcaseYear: sc?.year || p.date,
        showcaseClient: sc?.client || "Production Client",
        galleryVariant: sc?.galleryVariant || "horizontal",
      };
    }),
    experience: experience.map((exp, index) => ({
      id: `exp-${index + 1}`,
      ...exp,
      order: index + 1,
      published: true,
    })),
    education: education.map((edu, index) => ({
      id: `edu-${index + 1}`,
      ...edu,
      order: index + 1,
      published: true,
    })),
    skills: skillGroups.map((group, index) => ({
      id: `skill-group-${index + 1}`,
      category: group.category,
      items: group.items,
      order: index + 1,
      published: true,
    })),
    certificates: certificates.map((cert, index) => ({
      ...cert,
      order: index + 1,
      published: true,
    })),
    achievements: achievements.map((ach, index) => ({
      id: `ach-${index + 1}`,
      ...ach,
      order: index + 1,
      published: true,
    })),
    settings: {
      pageTitle: "Sushan D Jain — Full-Stack Architect & TCS Systems Engineer",
      metaDescription:
        "Interactive kinetic portfolio of Sushan D Jain, Full-Stack Developer & Systems Engineer at TCS. Creator of TuneXIA Cloud, Malnad Direct D2C & Kheti Bazaar. Anthropic Claude Certified Associate & 2nd Place TCS National AI Hackathon.",
      ogImageUrl: "/og-image.png",
      googleAnalyticsId: "",
      accentColor: "#6366F1",
      footerText: "© 2026 SUSHAN D JAIN · Engineered with Next.js 15 & Stretch Motion",
      sectionsVisibility: {
        hero: true,
        work: true,
        experience: true,
        credentials: true,
        arsenal: true,
        contact: true,
      },
    },
    lastUpdatedAt: new Date().toISOString(),
  };
}

// ----------------- Public Content Accessors -----------------

export function getContent(): StoredContent {
  const defaultData = getDefaultContent();
  if (!fs.existsSync(CONTENT_FILE)) {
    writeAtomicJson(CONTENT_FILE, defaultData);
    return defaultData;
  }
  return readJson<StoredContent>(CONTENT_FILE, defaultData);
}

export function saveContent(content: Partial<StoredContent>): StoredContent {
  const current = getContent();
  const updated: StoredContent = {
    ...current,
    ...content,
    lastUpdatedAt: new Date().toISOString(),
  };
  writeAtomicJson(CONTENT_FILE, updated);
  return updated;
}

// ----------------- Auth Accessors -----------------

export function getAuth(): StoredAuth | null {
  if (!fs.existsSync(AUTH_FILE)) {
    return null;
  }
  return readJson<StoredAuth | null>(AUTH_FILE, null);
}

export function saveAuth(auth: StoredAuth): void {
  writeAtomicJson(AUTH_FILE, auth);
}

// ----------------- Messages Accessors -----------------

export function getMessages(): StoredMessage[] {
  return readJson<StoredMessage[]>(MESSAGES_FILE, []);
}

export function saveMessage(msg: Omit<StoredMessage, "id" | "createdAt" | "read" | "starred">): StoredMessage {
  const messages = getMessages();
  const newMessage: StoredMessage = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...msg,
    createdAt: new Date().toISOString(),
    read: false,
    starred: false,
  };
  messages.unshift(newMessage);
  writeAtomicJson(MESSAGES_FILE, messages);
  return newMessage;
}

export function updateMessage(id: string, updates: Partial<StoredMessage>): StoredMessage | null {
  const messages = getMessages();
  const idx = messages.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  messages[idx] = { ...messages[idx], ...updates };
  writeAtomicJson(MESSAGES_FILE, messages);
  return messages[idx];
}

export function deleteMessage(id: string): boolean {
  const messages = getMessages();
  const filtered = messages.filter((m) => m.id !== id);
  if (filtered.length === messages.length) return false;
  writeAtomicJson(MESSAGES_FILE, filtered);
  return true;
}
