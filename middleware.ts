import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from '@/utils/supabase/server';

export async function middleware(request: NextRequest) {
  // 1. Actualizăm sesiunea
  const supabaseResponse = await updateSession(request);

  // 2. Verificăm dacă utilizatorul este logat
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const url = new URL(request.url);

  // 3. LOGICA DE ACCES:
  // Permitem oricui să vadă pagina principală (/)
  if (url.pathname === '/') {
    return supabaseResponse;
  }

  // Protejăm Dashboard-ul: dacă NU e logat și vrea la /dashboard, îl trimitem la /signin
  if (!user && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Dacă E DEJA logat și vrea la /signin, îl trimitem direct la /dashboard
  if (user && url.pathname.startsWith('/signin')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
