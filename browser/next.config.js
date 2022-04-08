/* eslint-disable @typescript-eslint/no-var-requires */
const withTM = require('next-transpile-modules')([
  '@solana/wallet-adapter-base',
  '@solana/wallet-adapter-react',
  '@solana/wallet-adapter-wallets',
]);

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: false,
  webpack5: true,
  experimental: {
    outputStandalone: true,
  },
});