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
      return refreshAccessToken(request).then((success) => {
        if (!success) {
          return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
      });
      
    }

    return NextResponse.next();

  } catch (err) {
    console.error("Erro ao decodificar token:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

async function refreshAccessToken(request: NextRequest): Promise<boolean> {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return false;
    }

     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    const newAccessToken = data.accessToken;
    const newRefreshToken = data.refreshToken;
    console.log("Tokens atualizados com sucesso");

    const responseNext = NextResponse.next();
    responseNext.cookies.set("accessToken", newAccessToken, { httpOnly: true, path: '/' });
    responseNext.cookies.set("refreshToken", newRefreshToken, { httpOnly: true, path: '/' });

    return true;

  } catch (err) {
    console.error("Erro ao atualizar token:", err);
    return false;
  }
}


export const config = {
  matcher: ["/dashboard/:path*", "/update/:path*", "/edit-profile/:path*", "/forgot-password/:path*"], 
};
