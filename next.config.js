/** @type {import('next').NextConfig} */
const nextConfig = {
  // REMOVER estas líneas que causan problemas en Vercel:
  // output: "export",
  // trailingSlash: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
