/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! ATENȚIE !!
    // Permite build-ului să se finalizeze chiar dacă există erori de tip.
    // Util pentru a pune site-ul live rapid când facem modificări la baza de date.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignoră erorile de linting în timpul build-ului.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
