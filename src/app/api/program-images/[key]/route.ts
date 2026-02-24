import { NextRequest, NextResponse } from "next/server";
import { upsertProgramImage } from "@/lib/controllers/programController";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  try {
    const { key } = await params;
    const { imageUrl } = await req.json() as { imageUrl: string };
    await upsertProgramImage(key, imageUrl);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
