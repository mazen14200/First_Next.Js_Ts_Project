import { NextResponse } from "next/server";

import {
  getHistory,
} from "../../../features/history";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const operationKeyIdParam =
      searchParams.get("OperationKeyId");

    const pageNumberParam =
      searchParams.get("PageNumber");

    const pageSizeParam =
      searchParams.get("PageSize");

    const history = await getHistory({
      operationKeyId:
        operationKeyIdParam
          ? Number(operationKeyIdParam)
          : undefined,

      userId:
        searchParams.get("UserId") ??
        undefined,

      fromDate:
        searchParams.get("FromDate") ??
        undefined,

      toDate:
        searchParams.get("ToDate") ??
        undefined,

      pageNumber:
        pageNumberParam
          ? Number(pageNumberParam)
          : 1,

      pageSize:
        pageSizeParam
          ? Number(pageSizeParam)
          : 10,

      search:
        searchParams.get("Search") ??
        undefined,
    });

    return NextResponse.json(history);
  } catch (error) {
    console.error(
      "GET /api/history failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch history",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}