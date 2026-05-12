/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    unoptimized: true,
  },
  // Uncomment the following line for static export (Vercel/Netlify):
  // output: 'export',
};

export default nextConfig;
