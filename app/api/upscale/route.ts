import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    // Extragem și parametrul isFreeTrial trimis din Dashboard
    const { imageUrl, tool, prompt, isFreeTrial } = await req.json();

    if (!imageUrl) return NextResponse.json({ error: 'Lipsește URL-ul fișierului' }, { status: 400 });

    let output;

    switch (tool) {
      case 'wan-video':
        // WAN 2.1 - Generare Video
        // Dacă e TRIAL: generăm doar 30 de cadre (~1.5 secunde) pentru viteză
        // Dacă e PRO: generăm 81 de cadre (~5 secunde) calitate maximă
        output = await replicate.run(
          "wan-video/wan-2.1-i2v-720p:194f447608e062145e695e1e48b8c71500d07a67f1395982e5bc01e405a8f4c2",
          { 
            input: { 
              image: imageUrl, 
              prompt: prompt || "cinematic motion", 
              frames: isFreeTrial ? 30 : 81 
            } 
          }
        );
        break;

      case 'face-swap':
        // GHOST Face Swap
        output = await replicate.run(
          "ghost/face-swap:940845cc82a74c43a084687d7b1d64388b14e91275464d6e9e6f9876793a0a3a",
          { input: { target_image: imageUrl, swap_image: imageUrl } }
        );
        break;

      case 'colorize':
        output = await replicate.run(
          "lucataco/colorize:0da600fab0c45a66211339fcca162f3d559535e5d579bc5d29590623f95b7302",
          { input: { image: imageUrl } }
        );
        break;

      default: // Neura Upscale (Mărire claritate)
        // Dacă e TRIAL: mărim doar de 1.5 ori
        // Dacă e PRO: mărim de 2 ori cu Face Enhance activat
        output = await replicate.run(
          "nightmareai/real-esrgan:f121d640d228e163cfd2582191e31c08ce2512a510ada9757afb388d0d40e10f",
          { 
            input: { 
              image: imageUrl, 
              upscale: isFreeTrial ? 1.5 : 2, 
              face_enhance: !isFreeTrial 
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
