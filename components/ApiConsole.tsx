"use client";

import { useState } from "react";
import { playPop, playSuccess } from "@/lib/sound";
import { Terminal, Play, Copy, Check, Activity, Server, Clock, ShieldCheck, Cpu } from "lucide-react";

interface Endpoint {
  id: string;
  name: string;
  method: "GET" | "POST";
  path: string;
  description: string;
  defaultParam: string;
  paramLabel: string;
  responseGenerator: (param: string) => Record<string, unknown>;
}

export default function ApiConsole() {
  const endpoints: Endpoint[] = [
    {
      id: "malnad-speedpost",
      name: "Malnad Direct — Postal Calculator",
      method: "POST",
      path: "/api/v1/shipping/speedpost-estimate",
      description: "Computes postal transit time and delivery eligibility from Kalasa (PIN 577124) to any Indian destination.",
      defaultParam: "560001",
      paramLabel: "Delivery Pincode",
      responseGenerator: (pincode: string) => {
        const pin = pincode.trim() || "560001";
        const isKarnataka = pin.startsWith("5");
        return {
          status: 200,
          success: true,
          originHub: {
            postOffice: "Kalasa Sub-Post Office",
            pincode: "577124",
            taluk: "Mudigere / Kalasa",
            district: "Chikkamagaluru, Western Ghats, Karnataka",
          },
          destination: {
            pincode: pin,
            zone: isKarnataka ? "Intra-State Karnataka Hub" : "Interstate Speed Post Corridor",
            estimatedDays: isKarnataka ? "2-3 business days" : "4-5 business days",
          },
          shippingMethod: "India Post Speed Post Tracked",
          charges: {
            baseRateINR: 65,
            orderDiscount: "FREE Shipping on orders over ₹750",
            packaging: "Eco-friendly Samse Valley Jute Pouches",
          },
          tracking: {
            type: "S10 13-digit barcode with live SMS notifications",
            apiIntegration: "Direct Postal Integration",
          },
        };
      },
    },
    {
      id: "tunexia-stream",
      name: "TuneXIA — Audio Streaming Engine",
      method: "GET",
      path: "/api/v1/tracks/stream",
      description: "Generates progressive chunked byte-range URLs, signed Cloudinary CDN tokens, and audio buffer metrics.",
      defaultParam: "mountain-mist-sessions",
      paramLabel: "Track Identifier",
      responseGenerator: (trackId: string) => ({
        status: 200,
        trackId: trackId || "mountain-mist-sessions",
        title: "Western Ghats Acoustic Harmonies",
        artist: "Kalasa Mountain Sessions",
        audioEngine: {
          codec: "audio/mp3",
          bitrate: "320 kbps High-Fidelity",
          streamingMode: "Byte-Range Progressive Chunking",
          cdnUrl: "https://res.cloudinary.com/tunexia/video/upload/v1729/tracks/master.mp3",
          bufferingLagMs: 14,
        },
        security: {
          authType: "JWT Bearer Token",
          roleAccess: "User / Premium Subscriber",
          tokenExpiresIn: "24h",
          sessionVerified: true,
        },
        analytics: {
          instantPlayLatencyMs: 28,
          cacheHitRate: "99.4%",
        },
      }),
    },
    {
      id: "henjodi-trek",
      name: "Henjodi Stores — Trek Permits API",
      method: "POST",
      path: "/api/v1/expeditions/kudremukh-permit",
      description: "Validates Western Ghats forest department permits, guide allocations, and homestay slots in Balagal, Kalasa.",
      defaultParam: "Kudremukh Peak",
      paramLabel: "Peak / Trail Name",
      responseGenerator: (trail: string) => ({
        status: 200,
        trailName: trail || "Kudremukh Peak Expedition",
        baseHub: {
          store: "Henjodi Stores & Spices",
          location: "Balagal Junction, Kalasa Main Road",
          coordinates: "13.184369° N, 75.319509° E",
          hotline: "+91 80731 78851 (Direct WhatsApp Dispatch)",
        },
        permits: {
          forestDepartmentPermit: "Mandatory Online Quota Allocated",
          guideAllocated: "Local Certified Forest Guide Included",
          trekDistanceKm: 22,
          altitudeMeters: 1894,
        },
        bookingDispatch: {
          status: "CONFIRMED_ONLINE",
          leadTime: "Immediate WhatsApp Handshake",
          homestayAccommodation: "Samse & Kalasa Valley Available",
        },
      }),
    },
    {
      id: "tcs-telemetry",
      name: "TCS — Enterprise Systems Health",
      method: "GET",
      path: "/api/v1/enterprise/systems/health",
      description: "Real-time production service mesh telemetry, API request/response triage, and incident root cause analysis (RCA).",
      defaultParam: "prod-gateway-blr-01",
      paramLabel: "Cluster Node ID",
      responseGenerator: (cluster: string) => ({
        clusterId: cluster || "prod-gateway-blr-01",
        systemStatus: "OPERATIONAL",
        productionUptime: "99.985% High Availability",
        activeMicroservices: 24,
        requestMetrics: {
          throughputRPS: 14250,
          averageLatencyMs: 36.4,
          errorRatePercent: 0.002,
        },
        incidentManagement: {
          openIncidents: 0,
          meanTimeToResolutionMinutes: 16.2,
          rootCauseAnalysis: "ALL_SYSTEMS_VERIFIED_OPTIMAL",
          itilProcessCompliance: "STRICT_ENTERPRISE_STANDARDS",
        },
        monitoringRole: "Sushan D Jain (Systems Engineer, TCS Bengaluru)",
      }),
    },
  ];

  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint>(endpoints[0]);
  const [paramInput, setParamInput] = useState<string>(endpoints[0].defaultParam);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number>(32);
  const [copied, setCopied] = useState(false);
  const [responseData, setResponseData] = useState<Record<string, unknown>>(
    endpoints[0].responseGenerator(endpoints[0].defaultParam)
  );

  const handleSelectEndpoint = (ep: Endpoint) => {
    setActiveEndpoint(ep);
    setParamInput(ep.defaultParam);
    setResponseData(ep.responseGenerator(ep.defaultParam));
    playPop();
  };

  const handleExecute = () => {
    setLoading(true);
    playPop();
    const randomizedLatency = Math.floor(22 + Math.random() * 26);

    setTimeout(() => {
      setLatency(randomizedLatency);
      setResponseData(activeEndpoint.responseGenerator(paramInput));
      setLoading(false);
      playSuccess();
    }, 240);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(responseData, null, 2));
    setCopied(true);
    playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="systems" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[var(--border-subtle)] pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 font-bold mb-2">
            <span>03 / INTERACTIVE SYSTEMS CONSOLE</span>
            <span>✦</span>
            <span>ENTERPRISE BACKEND SIMULATION</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            SYSTEMS &amp; API PLAYGROUND
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md font-mono leading-relaxed">
          Simulate live request payloads from TuneXIA, Malnad Direct, Henjodi Stores, and TCS production systems.
        </p>
      </div>

      {/* Terminal Window Container */}
      <div className="terminal-window">
        {/* Terminal Header Bar */}
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <div className="traffic-dots">
              <span className="traffic-dot bg-rose-500/80 cursor-pointer" onClick={() => playPop()} />
              <span className="traffic-dot bg-amber-500/80 cursor-pointer" onClick={() => playPop()} />
              <span className="traffic-dot bg-emerald-500/80 cursor-pointer" onClick={() => playPop()} />
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono ml-2 hidden sm:inline">
              sushan@tcs-systems-workstation: ~/api-mesh
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Activity size={13} className="animate-pulse" />
              <span>CLUSTER OPERATIONAL</span>
            </span>
            <span className="text-[var(--text-faint)]">|</span>
            <span className="text-indigo-400 font-bold">{latency}ms</span>
          </div>
        </div>

        {/* Console Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Endpoint Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {endpoints.map((ep) => (
              <button
                key={ep.id}
                type="button"
                onClick={() => handleSelectEndpoint(ep)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeEndpoint.id === ep.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-[#141826] text-[var(--text-muted)] hover:text-white hover:bg-[#1E2338]"
                }`}
              >
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    ep.method === "GET" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                  }`}
                >
                  {ep.method}
                </span>
                <span>{ep.name}</span>
              </button>
            ))}
          </div>

          {/* Request Input & URL Bar */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-[#121624] p-2 rounded-xl border border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1F32] rounded-lg text-emerald-400 font-bold shrink-0">
              <span>{activeEndpoint.method}</span>
            </div>
            <div className="flex-1 flex items-center px-3 py-2 text-[var(--text-muted)] min-w-0 overflow-x-auto">
              <span className="text-indigo-400 mr-1">https://api.sushandjain.dev</span>
              <span className="text-white font-medium">{activeEndpoint.path}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                aria-label={activeEndpoint.paramLabel}
                value={paramInput}
                onChange={(e) => setParamInput(e.target.value)}
                placeholder={activeEndpoint.paramLabel}
                className="bg-[#1A1F32] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 min-w-[150px]"
              />
              <button
                type="button"
                onClick={handleExecute}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play size={13} />
                <span>{loading ? "Calling..." : "Execute"}</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
            <p>{activeEndpoint.description}</p>
            <span className="hidden sm:inline text-indigo-400/80">Input: {activeEndpoint.paramLabel}</span>
          </div>

          {/* Output Code Window */}
          <div className="relative rounded-xl bg-[#080A10] border border-white/10 p-4 font-mono text-xs overflow-x-auto">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-[var(--text-faint)]">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">HTTP/2 200 OK</span>
                <span>content-type: application/json</span>
                <span>x-latency: {latency}ms</span>
                <span className="hidden sm:inline">x-powered-by: Express / Next.js API Routes</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1 text-[var(--text-muted)] hover:text-white transition-colors cursor-pointer"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? "Copied" : "Copy JSON"}</span>
              </button>
            </div>

            {/* JSON Content */}
            <pre className="text-indigo-200 leading-relaxed overflow-x-auto">
              {JSON.stringify(responseData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
