import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/terms-of-service",
        "/privacy-policy", 
        "/jobs"
      ],
      disallow: [
        "/api/",
        "/_next/",
        "/public/",
      ],
    },
  };
}