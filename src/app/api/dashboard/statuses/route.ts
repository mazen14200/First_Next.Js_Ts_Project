import { NextResponse } from "next/server";
import { getStatuses } from "../../../../features/status/services/status.services";

import { authErrorResponse } from "../../../../lib/api/auth-error-response";
export async function GET() {
  try {
    const statuses = await getStatuses();

    return NextResponse.json(statuses);
  } catch (error) {
     const authResponse = authErrorResponse(error);
     if (authResponse) return authResponse;
    console.log("GET STATUSES ERROR:", error);

    return NextResponse.json(
      { message: "Failed to get statuses" },
      { status: 500 }
    );
  }
}
