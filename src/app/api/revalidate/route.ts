import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");
  const type = request.nextUrl.searchParams.get("type") === "layout" ? "layout" : "page";

  if (!path) {
    return NextResponse.json({ message: "Missing path parameter" }, { status: 400 });
  }

  try {
    revalidatePath(path, type);
    return NextResponse.json({ revalidated: true, now: Date.now(), path, type });
  } catch (err) {
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}
