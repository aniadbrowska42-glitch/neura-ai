import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Lipsește URL-ul imaginii' }, { status: 400 });
    }

    const output = await replicate.run(
      "lucataco/real-esrgan:da30400030c7658516f84931a08620800b3d6bc9f0951307b233a7f805908e0a",
      {
        input: {
          image: imageUrl,
          upscale: 4,
          face_enhance: true
        }
      }
    );

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error("Eroare AI:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
