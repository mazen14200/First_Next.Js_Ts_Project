import { NextResponse } from "next/server";

import { getNewProjectCode } from "../../../../features/projects";

export async function GET() {
  try {
    const data = await getNewProjectCode();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch new project code:", error);

    return NextResponse.json(
      { message: "Failed to fetch new project code" },
      { status: 500 }
    );
  }
}