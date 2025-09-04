import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin(); // uses ./src/i18n/request by default

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  transpilePackages: ['next-intl']
};

export default withNextIntl(nextConfig);
