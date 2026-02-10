import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/auth", "routes/auth.tsx"),
  route("/upload", "routes/upload.tsx"),
  route("/resume/:id", "routes/Resume.tsx"),
  route("/builder", "routes/builder.tsx"),
  route("/wipe-data", "routes/wipe.tsx"),
] satisfies RouteConfig;
