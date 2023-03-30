const nextConfig = {
  reactStrictMode: true,
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'yt3.googleusercontent.com',
        port: '',
        pathname: '/**',
      }
    ]
  }
}

module.exports = nextConfig
