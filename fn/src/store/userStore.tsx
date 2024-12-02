import {create} from 'zustand';
import api from '../api/axiosConfig';

interface UserInfo {
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  vegan: boolean;
  registered_allergy: boolean;
  registered_body_info: boolean;
  body_info?: {
    height: number;
    duration: number;
    goal: number;
  };
}

interface UserStore {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  fetchUserInfo: () => Promise<void>;
  updateAllergyStatus: (status: boolean) => void;
  updateBodyInfoStatus: (status: boolean) => void;
}

export const useUserStore = create<UserStore>()(set => ({
  userInfo: null,
  setUserInfo: info => set({userInfo: info}),
  fetchUserInfo: async () => {
    try {
      const [userResponse, bodyInfoResponse] = await Promise.all([
        api.get('/account/myinfo'),
        api.get('/exercise/body_info'),
      ]);

      const hasBodyInfo = bodyInfoResponse.data.height !== 0;

      set({
        userInfo: {
          ...userResponse.data,
          registered_body_info: hasBodyInfo,
          body_info: hasBodyInfo ? bodyInfoResponse.data : null,
        },
      });
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
    }
  },
  updateAllergyStatus: status =>
    set(state => ({
      userInfo: state.userInfo ? {...state.userInfo, registered_allergy: status} : null,
    })),
  updateBodyInfoStatus: status =>
    set(state => ({
      userInfo: state.userInfo ? {...state.userInfo, registered_body_info: status} : null,
    })),
}));
