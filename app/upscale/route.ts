if (!imageUrl) {
  return NextResponse.json({ error: 'Lipsește URL-ul imaginii' }, { status: 400 });
}

// Apelăm modelul Real-ESRGAN (cel mai bun pentru Neura)
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
