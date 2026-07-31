import type { NextConfig } from "next";

/** Bezpečnostní hlavičky — web nesmí jít vložit do cizího rámečku a prohlížeč
 *  si nemá domýšlet typ souboru. */
const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  // letní program skončil a stránka se z něj stala archivem — staré odkazy
  // (letáky, e-maily, výsledky vyhledávání) musí dál fungovat
  async redirects() {
    return [
      {
        source: "/prazdninovy-program",
        destination: "/probehle-akce",
        permanent: true,
      },
      {
        source: "/prazdninovy-program/:path*",
        destination: "/probehle-akce",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
