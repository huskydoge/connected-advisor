/** @type {import('next').NextConfig} */
const nextConfig = {};

export default {
  async rewrites() {
    return [
      {
        source: "/api-text/:path*",
        destination:
          "https://waline-connected-advisor-pud8gagjj-huskydoge.vercel.app/:path*",
      },
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["via.placeholder.com"], // 将占位符图片的域名添加到这里
  },
};
