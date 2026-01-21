import { createClient } from '@/utils/supabase/server'; // Acesta e helper-ul din template
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Dacă există o eroare, îl trimitem înapoi la signin cu un mesaj simplu
      return NextResponse.redirect(`${requestUrl.origin}/signin?error=${error.message}`);
    }
  }

  // AICI este modificarea cheie: Îl trimitem direct în dashboard
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
