import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static site: `next build` writes plain HTML/CSS/JS to `out/`.
  output: "export",
  // Emit `/moods/1/index.html` rather than `/moods/1.html`.
  trailingSlash: true,
  // The default image loader needs a server, which a static export doesn't have.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
