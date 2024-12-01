import axios from 'axios';
import JWTManager from '../utils/jwtManager.tsx';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 5000,
});

// 요청 인터셉터
api.interceptors.request.use(
  async config => {
    const token = await JWTManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 토큰 만료 시 리프레시 토큰으로 재발급
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await JWTManager.getRefreshToken();
        const response = await axios.post('/account/refresh', {
          refresh: refreshToken,
        });
        const {access} = response.data;
        await JWTManager.setTokens({access: access as string, refresh: refreshToken as string});

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (err) {
        console.log(err);
        // 리프레시 토큰도 만료된 경우 로그아웃 처리
        await JWTManager.clearTokens();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
