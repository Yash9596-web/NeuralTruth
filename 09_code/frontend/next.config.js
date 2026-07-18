/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for Docker builds only.
  // opennextjs-cloudflare has its own output mechanism and does not need this.
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" } : {}),
};

module.exports = nextConfig;
