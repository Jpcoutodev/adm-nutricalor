import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';

  // Verifica se não há sessão e não é a página de login
  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verifica se há sessão e é a página de login
  if (session && isLoginPage) {
    try {
      const parsed = await decrypt(session);
      if (parsed) {
         return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
       // Sessão inválida
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
