import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Atenție: Ai nevoie de cheia SERVICE_ROLE pentru a modifica creditele
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret!);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Luăm ID-ul utilizatorului și numărul de credite din metadatele Stripe
    const userId = session.client_reference_id;
    
    // Verificăm ce pachet a cumpărat (ne uităm în produsele Stripe sau folosim metadata)
    // Pentru acest exemplu, presupunem că pachetul are 50 de credite
    const creditsToAdd = 50; 

    if (userId) {
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('id', userId)
        .single();

      const newCredits = (data?.credits || 0) + creditsToAdd;

      await supabase
        .from('users')
        .update({ credits: newCredits })
        .eq('id', userId);
        
      console.log(`✅ Adăugat ${creditsToAdd} credite utilizatorului ${userId}`);
    }
  }

  return NextResponse.json({ received: true });
}
