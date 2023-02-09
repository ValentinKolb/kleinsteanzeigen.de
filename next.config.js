/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ['page.tsx', 'api.ts'],
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone' // for docker
}

module.exports = nextConfig