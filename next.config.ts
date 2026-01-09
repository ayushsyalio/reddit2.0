// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io", "img.clerk.com"],
    unoptimized: true, 
  },
};

module.exports = nextConfig;
