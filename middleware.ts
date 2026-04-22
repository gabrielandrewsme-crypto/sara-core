import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    if (!token) return;

    // Not activated → force the user onto the activation gate
    if (!token.is_active && pathname !== "/ativar") {
      return NextResponse.redirect(new URL("/ativar", req.url));
    }

    // Already activated → don't let them linger on the gate
    if (token.is_active && pathname === "/ativar") {
      return NextResponse.redirect(new URL("/app/rotina", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    }
  }
);

export const config = {
  matcher: ["/app/:path*", "/ativar"]
};
