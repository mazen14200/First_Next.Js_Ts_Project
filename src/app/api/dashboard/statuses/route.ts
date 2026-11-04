import { NextResponse } from "next/server";
import { getStatuses } from "../../../../features/dashboard/services/statuses.service";

export async function GET() {
  try {
    const statuses = await getStatuses();

    return NextResponse.json(statuses);
  } catch (error) {
    console.log("GET STATUSES ERROR:", error);

    return NextResponse.json(
      { message: "Failed to get statuses" },
      { status: 500 }
    );
  }
}