import { NextResponse } from "next/server";
import { getAllProgramImages } from "@/lib/controllers/programController";

export async function GET() {
  try {
    const data = await getAllProgramImages();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 },
    );
  }
}
