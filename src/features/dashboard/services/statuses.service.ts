import axios from "axios";
import type { Status } from "../types/status.types";

export const getStatuses = async (): Promise<Status[]> => {
  const response = await axios.get<Status[]>(
    "https://apiems.runasp.net/api/Status"
  );

  return response.data;
};