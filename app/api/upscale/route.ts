import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { imageUrl, tool, prompt } = await req.json();

    if (!imageUrl) return NextResponse.json({ error: 'Lipsește URL-ul' }, { status: 400 });

    let output;

    switch (tool) {
      case 'wan-video':
        // Model: Wan 2.1 - Image to Video (720p)
        output = await replicate.run(
          "wan-video/wan-2.1-i2v-720p:194f447608e062145e695e1e48b8c71500d07a67f1395982e5bc01e405a8f4c2",
          {
            input: {
              image: imageUrl,
              prompt: prompt || "smooth cinematic motion, high quality",
              frames: 81 // aprox 5 secunde de video
            }
          }
        );
        break;

      case 'face-swap':
        // Model: Ghost Face Swap
        output = await replicate.run(
          "ghost/face-swap:940845cc82a74c43a084687d7b1d64388b14e91275464d6e9e6f9876793a0a3a",
          { input: { target_image: imageUrl, swap_image: imageUrl } } // Aici vom rafina ulterior
        );
        break;

      case 'colorize':
        output = await replicate.run(
          "lucataco/colorize:0da600fab0c45a66211339fcca162f3d559535e5d579bc5d29590623f95b7302",
          { input: { image: imageUrl } }
        );
        break;

      default: // Upscale (Real-ESRGAN)
        output = await replicate.run(
          "nightmareai/real-esrgan:f121d640d228e163cfd2582191e31c08ce2512a510ada9757afb388d0d40e10f",
          { input: { image: imageUrl, upscale: 2, face_enhance: true } }
        );
    }

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error("Eroare Neura AI:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
