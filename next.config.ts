import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // This line tells Next.js 16 to be okay with the PWA plugin
  turbopack: {}, 
};

export default withPWA(nextConfig);