import type { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin: string | undefined, callback) {
    const allowedOrigins = [process.env.FRONTEDN_URL];
    if (process.argv[2] === "--api") {
      allowedOrigins.push(undefined);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Error de cors"));
    }
  },

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["content-type", "authorization"],
};
