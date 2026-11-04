import axios from "axios";
import { cookies } from "next/headers";

const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// serverApi.interceptors.request.use(async (config) => {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value;

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });

serverApi.interceptors.request.use(async (config) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  console.log("🔥🔥 SERVER API REQUEST INTERCEPTOR HIT");

  console.log("🔥 ACCESS TOKEN EXISTS:", !!accessToken);

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log("🔥 AUTH HEADER WAS SET");
  } else {
    console.log("❌ NO ACCESS TOKEN");
  }

  return config;
});

serverApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const cookieStore = await cookies();

      const accessToken = cookieStore.get("accessToken")?.value;
      const refreshToken = cookieStore.get("refreshToken")?.value;

      if (!accessToken || !refreshToken) {
        return Promise.reject(error);
      }

      console.log("ACCESS TOKEN EXPIRED - TRYING REFRESH");

      const refreshResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/refresh`,
        {
          refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt,
      } = refreshResponse.data;

      console.log("TOKEN REFRESH SUCCESS");

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      };

      cookieStore.set(
        "accessToken",
        newAccessToken,
        cookieOptions
      );

      cookieStore.set(
        "refreshToken",
        newRefreshToken,
        cookieOptions
      );

      cookieStore.set(
        "accessTokenExpiresAt",
        expiresAt,
        cookieOptions
      );

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return serverApi(originalRequest);
    } catch (refreshError) {
      console.log("AUTOMATIC REFRESH FAILED:", refreshError);

      const cookieStore = await cookies();

      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      cookieStore.delete("accessTokenExpiresAt");

      return Promise.reject(refreshError);
    }
  }
);

export default serverApi;