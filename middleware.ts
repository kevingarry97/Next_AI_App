export { default } from "next-auth/middleware";

export const config = { matcher: ["/create-prompt/:path*", "/update-prompt/:path*"] };