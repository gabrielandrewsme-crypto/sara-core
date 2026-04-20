import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    
    // Redirect to block page if user is logged in but has no access
    if (token && !token.has_access && req.nextUrl.pathname !== "/bloqueado") {
      return NextResponse.redirect(new URL("/bloqueado", req.url));
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
  matcher: ["/app/:path*", "/bloqueado"]
};
