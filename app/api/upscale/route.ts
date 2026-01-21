import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { imageUrl, mediaType } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Lipsește URL-ul fișierului' }, { status: 400 });
    }

    let output;

    if (mediaType === 'video') {
      // MOTORUL AI PENTRU VIDEO (Real-ESRGAN Video)
      // Acest model mărește rezoluția și elimină "zgomotul" din cadrele video
      output = await replicate.run(
        "cjwbw/real-esrgan-video:6073f6057088909890d96d7413a9688b1397d195f2e6981881a79f826379c46d",
        {
          input: {
            video: imageUrl,
            upscale: 2,
            fps: 25
          }
        }
      );
    } else {
      // MOTORUL AI PENTRU FOTO (Real-ESRGAN Face Recovery)
      // Cel mai bun pentru poze vechi sau fețe pixelate
      output = await replicate.run(
        "nightmareai/real-esrgan:f121d640d228e163cfd2582191e31c08ce2512a510ada9757afb388d0d40e10f",
        {
          input: {
            image: imageUrl,
            upscale: 2,
            face_enhance: true
          }
        }
      );
    }

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error("Eroare Neura AI Engine:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
