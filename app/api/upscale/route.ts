import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Lipsește URL-ul' }, { status: 400 });
    }

    // Folosim CodeFormer - un model ultra-stabil pentru claritate și fețe
    const output = await replicate.run(
      "sczhou/codeformer:7de2ea1114d5a356064132448a52994968361f1854930be62879574187e1458e",
      {
        input: {
          image: imageUrl,
          upscale: 2,
          face_upsample: true,
          background_enhance: true,
          codeformer_fidelity: 0.7
        }
      }
    );

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error("Eroare Replicate:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
