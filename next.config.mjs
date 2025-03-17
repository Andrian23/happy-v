/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.shopify.com", "s3-alpha-sig.figma.com", "lh3.googleusercontent.com", "res.cloudinary.com"],
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.html$/,
      use: "html-loader",
    })

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "aws-sdk": false,
        nock: false,
        "mock-aws-s3": false,
        "set-blocking": false,
        yjs: false,
      }
    }

    return config
  },
}

export default nextConfig
