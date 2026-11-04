import api from "../../../services/server-api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  tokenType: string;
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {

  const response = await api.post<LoginResponse>("/Auth/login", data);

  return response.data;
  
};