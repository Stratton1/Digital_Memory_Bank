import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/"], // Keep dashboard private
    },
    sitemap: "https://memory-bank.example.com/sitemap.xml",
  };
}
