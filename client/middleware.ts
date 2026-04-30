import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const role = req.cookies.get("role")?.value;

  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/employee") && role !== "employee") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}