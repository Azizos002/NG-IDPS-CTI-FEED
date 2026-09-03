import { NextRequest, NextResponse } from "next/server";

import { readSeed, writeSeed } from "@/lib/seed";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const { actualities } = readSeed();

    const idx = actualities.findIndex(
      (x) => x.id === id || x.slug === id
    );

    if (idx === -1) {
      return NextResponse.json(
        { error: "not found" },
        { status: 404 }
      );
    }

    actualities[idx].status = "PUBLISHED";
    actualities[idx].publishedAt = new Date().toISOString();

    writeSeed({ actualities });

    return NextResponse.json({
      data: actualities[idx],
    });
  } catch (err: unknown) {
    console.error('POST /api/v1/actualities/[id]/publish error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}