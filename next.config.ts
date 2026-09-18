// // import type { NextConfig } from "next";
// // import createNextIntlPlugin from "next-intl/plugin";

// // const nextConfig: NextConfig = {
// //   images: {
// //     remotePatterns: [
// //       {
// //         protocol: "http",
// //         hostname: "localhost",
// //         port: "8000",
// //         pathname: "/media/**",
// //       },
// //     ],
// //   },
// // };

// // const withNextIntl = createNextIntlPlugin();

// // export default withNextIntl(nextConfig);
// import type { NextConfig } from "next";
// import createNextIntlPlugin from "next-intl/plugin";

// const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// const nextConfig: NextConfig = {
// images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '8000',
//         pathname: '/**', // اجازه لود تمام عکس‌های این سرور
//       },
//       {
//         protocol: 'http',
//         hostname: '127.0.0.1',
//         port: '8000',
//         pathname: '/**', 
//       }
//     ],
//   },
// };

// export default withNextIntl(nextConfig);
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default withNextIntl(nextConfig);