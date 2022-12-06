const withTM = require('next-transpile-modules')(["react-icons"]); // pass the modules you would like to see transpiled

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone' // for docker
}

module.exports =  withTM(nextConfig)