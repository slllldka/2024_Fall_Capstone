import AsyncStorage from '@react-native-async-storage/async-storage';

interface JWTTokens {
  access: string;
  refresh: string;
}

class JWTManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  // JWT 토큰 저장
  static async setTokens(tokens: JWTTokens): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [this.ACCESS_TOKEN_KEY, tokens.access],
        [this.REFRESH_TOKEN_KEY, tokens.refresh],
      ]);
    } catch (error) {
      console.error('토큰 저장 실패:', error);
    }
  }

  // Access 토큰 가져오기
  static async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('액세스 토큰 조회 실패:', error);
      return null;
    }
  }

  // Refresh 토큰 가져오기
  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('리프레시 토큰 조회 실패:', error);
      return null;
    }
  }

  // 토큰 삭제 (로그아웃 시)
  static async clearTokens(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.ACCESS_TOKEN_KEY,
        this.REFRESH_TOKEN_KEY,
      ]);
    } catch (error) {
      console.error('토큰 삭제 실패:', error);
    }
  }
}

export default JWTManager; 