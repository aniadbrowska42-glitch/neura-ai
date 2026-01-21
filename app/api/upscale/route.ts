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

    // Am actualizat modelul la o versiune foarte stabilă de Real-ESRGAN
    const output = await replicate.run(
      "nightmareai/real-esrgan:f121d640d228e163cfd2582191e31c08ce2512a510ada9757afb388d0d40e10f",
      {
        input: {
          image: imageUrl,
          upscale: 2,
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
