/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["imagedelivery.net", "media-cdn.tripadvisor.com"],
  },
};

module.exports = nextConfig;
