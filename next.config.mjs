/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/audio/:file*.m4a",
        headers: [{ key: "Content-Type", value: "audio/mp4" }],
      },
    ]
  },
}

export default nextConfig
