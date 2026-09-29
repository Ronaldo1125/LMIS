import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/api/**",
        search: "",
      },
      {
        pathname: "/uploads/**",
        search: "",
      },
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.0.120",
        port: "5000",
        pathname: "/api/**",
      },
      {
        protocol: "http",
        hostname: "192.168.0.120",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.0.120:5000/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://192.168.0.120:5000/uploads/:path*",
      },
    ];
  },
};

export default nextConfig;
