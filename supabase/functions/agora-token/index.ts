// Agora RTC Token Generator — Supabase Edge Function
// This runs SERVER-SIDE only. AGORA_APP_CERTIFICATE is never exposed to the browser.
//
// Deploy with:
//   supabase functions deploy agora-token --no-verify-jwt
//
// Set secrets with:
//   supabase secrets set AGORA_APP_ID=your_app_id
//   supabase secrets set AGORA_APP_CERTIFICATE=your_certificate

import { createHmac } from "node:crypto";
import * as zlib from "node:zlib";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ─── Agora Token V2 Builder (Pure TS implementation) ──────────
// Based on: https://github.com/AgoraIO/Tools/tree/master/DynamicKey/AgoraDynamicKey/nodejs

const PRIVILEGES = {
  JOIN_CHANNEL: 1,
  PUBLISH_AUDIO: 2,
  PUBLISH_VIDEO: 3,
  PUBLISH_DATA: 4,
};

function packUint16(x: number): Uint8Array {
  const buf = new ArrayBuffer(2);
  new DataView(buf).setUint16(0, x, true);
  return new Uint8Array(buf);
}

function packUint32(x: number): Uint8Array {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setUint32(0, x, true);
  return new Uint8Array(buf);
}

function packInt32(x: number): Uint8Array {
  const buf = new ArrayBuffer(4);
  new DataView(buf).setInt32(0, x, true);
  return new Uint8Array(buf);
}

function packString(s: string): Uint8Array {
  const enc = new TextEncoder().encode(s);
  const len = packUint16(enc.length);
  const out = new Uint8Array(len.length + enc.length);
  out.set(len, 0);
  out.set(enc, len.length);
  return out;
}

function packMapUint32(m: Record<number, number>): Uint8Array {
  const entries = Object.entries(m).sort(([a], [b]) => Number(a) - Number(b));
  const parts: Uint8Array[] = [packUint16(entries.length)];
  for (const [k, v] of entries) {
    parts.push(packUint16(Number(k)));
    parts.push(packUint32(v));
  }
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) { out.set(p, offset); offset += p.length; }
  return out;
}

function buildTokenWithUid(
  appId: string,
  appCertificate: string,
  channelName: string,
  uid: number,
  role: number,
  privilegeExpiredTs: number,
): string {
  const now = Math.floor(Date.now() / 1000);
  const salt = Math.floor(Math.random() * 0xFFFFFFFF);
  const ts = now + 24 * 3600;

  const privileges: Record<number, number> = {};
  if (role === 1) { // publisher
    privileges[PRIVILEGES.JOIN_CHANNEL] = privilegeExpiredTs;
    privileges[PRIVILEGES.PUBLISH_AUDIO] = privilegeExpiredTs;
    privileges[PRIVILEGES.PUBLISH_VIDEO] = privilegeExpiredTs;
    privileges[PRIVILEGES.PUBLISH_DATA] = privilegeExpiredTs;
  } else {
    privileges[PRIVILEGES.JOIN_CHANNEL] = privilegeExpiredTs;
  }

  const message = new Uint8Array([
    ...packUint32(salt),
    ...packUint32(ts),
    ...packMapUint32(privileges),
  ]);

  const rawSig = [
    ...new TextEncoder().encode(appId),
    ...new TextEncoder().encode(channelName),
    ...packUint32(uid),
    ...message,
  ];

  const sig = createHmac("sha256", appCertificate)
    .update(Buffer.from(rawSig))
    .digest();

  const content = new Uint8Array([
    ...packString(sig.toString("base64")),
    ...packUint32(salt),
    ...packUint32(ts),
    ...packMapUint32(privileges),
  ]);

  const compressed = zlib.deflateRawSync(Buffer.from(content));

  const versionStr = "006";
  const appIdHex = appId;
  const encodedContent = Buffer.from(compressed).toString("base64");
  return `${versionStr}${appIdHex}${encodedContent}`;
}

// ─── Handler ──────────────────────────────────────────────────
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { channelName, uid } = await req.json();

    if (!channelName) {
      return new Response(
        JSON.stringify({ error: "channelName is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const appId = Deno.env.get("AGORA_APP_ID");
    const appCertificate = Deno.env.get("AGORA_APP_CERTIFICATE");

    // If no certificate is configured, return null token (safe for testing mode)
    if (!appId || !appCertificate || appCertificate === "DISABLED") {
      return new Response(
        JSON.stringify({ token: null, mode: "testing" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const expirationSeconds = 3600; // 1 hour
    const privilegeExpiredTs = Math.floor(Date.now() / 1000) + expirationSeconds;

    // Convert string UID to number (Agora requires numeric UID)
    const numericUid = uid
      ? parseInt(uid.replace(/-/g, "").slice(0, 8), 16) & 0xFFFFFFFF
      : 0;

    const token = buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      numericUid,
      1, // publisher role
      privilegeExpiredTs,
    );

    return new Response(
      JSON.stringify({ token, expiresIn: expirationSeconds }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Token generation error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate token", token: null }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
