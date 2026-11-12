import serverApi from "@/services/server-api";

import type {
  Status,
  CreateStatusRequest,
  UpdateStatusRequest,
} from "@/features/status/types/status.types";

const STATUS_ENDPOINT = "/Status";

export async function getStatuses(): Promise<Status[]> {
  const response = await serverApi.get<Status[]>(
    STATUS_ENDPOINT
  );

  return response.data;
}

export async function getStatusById(
  id: number
): Promise<Status> {
  const response = await serverApi.get<Status>(
    `${STATUS_ENDPOINT}/${id}`
  );

  return response.data;
}

export async function createStatus(
  data: CreateStatusRequest
): Promise<Status> {
  const response = await serverApi.post<Status>(
    STATUS_ENDPOINT,
    data
  );

  return response.data;
}

export async function updateStatus(
  id: number,
  data: UpdateStatusRequest
): Promise<void> {
  await serverApi.put(
    `${STATUS_ENDPOINT}/${id}`,
    data
  );
}

export async function deleteStatus(
  id: number
): Promise<void> {
  await serverApi.delete(
    `${STATUS_ENDPOINT}/${id}`
  );
}