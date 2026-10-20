"use client";

import { useState } from "react";
import { playPop, playSuccess } from "@/lib/sound";
import { Terminal, Play, Copy, Check, ShieldCheck, Activity, Server, Clock } from "lucide-react";

interface Endpoint {
  id: string;
  name: string;
  method: "GET" | "POST";
  path: string;
  description: string;
  defaultPayload?: Record<string, unknown>;
  defaultParam?: string;
  responseGenerator: (param: string) => Record<string, unknown>;
}

export default function ApiConsole() {
  const endpoints: Endpoint[] = [
    {
      id: "malnad-speedpost",
      name: "Malnad Direct — Speed Post API",
      method: "POST",
      path: "/api/v1/shipping/speedpost-estimate",
      description: "Computes postal transit time and delivery eligibility from Kalasa (PIN 577124) to any Indian destination.",
      defaultParam: "560001",
      responseGenerator: (pincode: string) => ({
        status: 200,
        success: true,
        origin: {
          hub: "Kalasa Sub-Post Office",
          pincode: "577124",
          district: "Chikkamagaluru, Karnataka",
        },
        destination: {
          pincode: pincode || "560001",
          state: pincode.startsWith("5") ? "Karnataka" : "Interstate Hub",
        },
        deliveryMethod: "India Post Speed Post Direct",
        estimatedDays: pincode.startsWith("5") ? "2-3 business days" : "4-5 business days",
        rate: {
          standardRateINR: 65,
          orderThresholdFreeShippingINR: 750,
          currentOrderDiscount: "FREE on orders > ₹750",
        },
        packaging: "Biodegradable Samse Valley jute pouches",
        trackingType: "S10 13-digit alphanumeric barcode with live SMS",
      }),
    },
    {
      id: "tunexia-stream",
      name: "Tunexia — Audio Stream API",
      method: "GET",
      path: "/api/v1/tracks/stream",
      description: "Fetches progressive chunk metadata, signed Cloudinary CDN URLs, and role-based permissions.",
      defaultParam: "peaberry-acoustic-01",
      responseGenerator: (trackId: string) => ({
        status: 200,
        trackId: trackId || "peaberry-acoustic-01",
        title: "Mountain Mist Harmonies",
        artist: "Western Ghats Sessions",
        format: "audio/mpeg",
        bitrateKbps: 320,
        streamingMode: "Progressive Chunked Byte-Range",
        cdnEndpoint: "https://res.cloudinary.com/tunexia/video/upload/v1729/tracks/master.mp3",
        auth: {
          type: "JWT Bearer",
          role: "User",
          issuedAt: new Date().toISOString(),
          expiresIn: "24h",
        },
        telemetry: {
          bufferingLagMs: 14,
          cacheHit: true,
        },
      }),
    },
    {
      id: "tcs-health",
      name: "TCS — Enterprise Systems Health",
      method: "GET",
      path: "/api/v1/enterprise/systems/health",
      description: "Real-time production service mesh monitoring, API triage status, and incident root cause telemetry.",
      defaultParam: "prod-gateway-blr",
      responseGenerator: (gateway: string) => ({
        systemStatus: "OPERATIONAL",
        cluster: gateway || "prod-gateway-blr",
        slaUptime: "99.985%",
        activeMicroservices: 18,
        activeWorkflows: 1420,
        incidentMetrics: {
          openIncidents: 0,
          meanTimeToResolutionMinutes: 18.4,
          rootCauseAnalysisStatus: "ALL_SYSTEMS_OPTIMAL",
        },
        apiThroughputRPS: 12450,
        averageLatencyMs: 38.2,
        tcsEngineerOnCall: "Sushan D Jain (Systems Engineer)",
      }),
    },
  ];

  const [activeEndpoint, setActiveEndpoint] = useState<Endpoint>(endpoints[0]);
  const [paramInput, setParamInput] = useState<string>(endpoints[0].defaultParam || "");
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState<number>(34);
  const [copied, setCopied] = useState(false);
  const [responseData, setResponseData] = useState<Record<string, unknown>>(
    endpoints[0].responseGenerator(endpoints[0].defaultParam || "")
  );

  const handleSelectEndpoint = (ep: Endpoint) => {
    setActiveEndpoint(ep);
    setParamInput(ep.defaultParam || "");
    setResponseData(ep.responseGenerator(ep.defaultParam || ""));
    playPop();
  };

  const handleExecute = () => {
    setLoading(true);
    playPop();
    const randomizedLatency = Math.floor(24 + Math.random() * 32);

    setTimeout(() => {
      setLatency(randomizedLatency);
      setResponseData(activeEndpoint.responseGenerator(paramInput));
      setLoading(false);
      playSuccess();
    }, 280);
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
            <span>02 / INTERACTIVE CONSOLE</span>
            <span>✦</span>
            <span>REST ARCHITECTURE & SYSTEMS OPS</span>
          </div>
          <h2
            className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)]"
            style={{ fontFamily: "var(--font-d)" }}
          >
            SYSTEMS PLAYGROUND
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md font-mono">
          Simulate live API payloads from Tunexia, Malnad Direct, and TCS Systems Engineering environments.
        </p>
      </div>

      {/* Terminal Container */}
      <div className="terminal-window">
        {/* Terminal Header Bar */}
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <div className="traffic-dots">
              <span className="traffic-dot bg-rose-500/80" />
              <span className="traffic-dot bg-amber-500/80" />
              <span className="traffic-dot bg-emerald-500/80" />
            </div>
            <span className="text-xs text-[var(--text-muted)] font-mono ml-2 hidden sm:inline">
              sushan@tcs-systems-workstation: ~/api-mesh
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Activity size={13} className="animate-pulse" />
              <span>CLUSTER HEALTHY</span>
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
                    : "bg-[#141824] text-[var(--text-muted)] hover:text-white hover:bg-[#1E2336]"
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
          <div className="flex flex-col sm:flex-row items-stretch gap-2 bg-[#121622] p-2 rounded-xl border border-white/10 font-mono text-xs">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1A1F30] rounded-lg text-emerald-400 font-bold shrink-0">
              <span>{activeEndpoint.method}</span>
            </div>
            <div className="flex-1 flex items-center px-3 py-2 text-[var(--text-muted)] min-w-0 overflow-x-auto">
              <span className="text-indigo-400 mr-1">https://api.sushandjain.dev</span>
              <span className="text-white font-medium">{activeEndpoint.path}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                aria-label="API Parameter Input"
                value={paramInput}
                onChange={(e) => setParamInput(e.target.value)}
                placeholder="Parameter / Query"
                className="bg-[#1A1F30] border border-white/10 rounded-lg px-3 py-2 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500 min-w-[140px]"
              />
              <button
                type="button"
                onClick={handleExecute}
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play size={13} />
                <span>{loading ? "Calling..." : "Send"}</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[var(--text-muted)] font-mono">
            {activeEndpoint.description}
          </p>

          {/* Output Code Window */}
          <div className="relative rounded-xl bg-[#080A0F] border border-white/10 p-4 font-mono text-xs overflow-x-auto">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[11px] text-[var(--text-faint)]">
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-bold">HTTP/2 200 OK</span>
                <span>content-type: application/json</span>
                <span>x-latency: {latency}ms</span>
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
