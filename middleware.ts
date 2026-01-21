import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from '@/utils/supabase/server';

export async function middleware(request: NextRequest) {
  // 1. Mai întâi actualizăm sesiunea (obligatoriu pentru Supabase)
  const supabaseResponse = await updateSession(request);

  // 2. Verificăm dacă utilizatorul este logat
  // Folosim un client temporar pentru a verifica starea sesiunii
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 3. LOGICA DE PROTECȚIE
  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isAccount = request.nextUrl.pathname.startsWith('/account');

  // Dacă userul încearcă să intre în Dashboard fără să fie logat, îl trimitem la logare
  if (!user && (isDashboard || isAccount)) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Dacă userul este deja logat și încearcă să intre pe pagina de logare, îl trimitem în Dashboard
  if (user && request.nextUrl.pathname === '/signin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
};
