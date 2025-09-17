import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { TokenPayload } from "@/types/token-payload";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const payload: TokenPayload = jwtDecode<TokenPayload>(accessToken);

    const now = Date.now() / 1000;
    
    if (payload.exp && payload.exp < now) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/update/:path*", "/edit-profile/:path*" ],
};
