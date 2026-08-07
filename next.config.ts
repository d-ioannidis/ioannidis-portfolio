import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  images: {
    unoptimized: true, // Απαραίτητο για στατικό export στο Cloudflare
  },
};

export default nextConfig;

if (process.env.NODE_ENV === "development") {
  import("@opennextjs/cloudflare").then((m) =>
    m.initOpenNextCloudflareForDev(),
  );
}
