import {create} from 'zustand';
import api from '../api/axiosConfig';

interface BodyInfo {
  height: number;
  duration: number;
  goal: number;
}

interface UserInfo {
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  vegan: boolean;
  registered_allergy: boolean;
  registered_body_info: boolean;
  body_info?: BodyInfo | null;
}

interface UserStore {
  userInfo: UserInfo;
  loading: boolean;
  setUserInfo: (info: UserInfo) => void;
  fetchUserInfo: () => Promise<void>;
  updateAllergyStatus: (status: boolean) => void;
  updateBodyInfoStatus: (status: boolean) => void;
}

// 기본값 정의
const defaultUserInfo: UserInfo = {
  email: '',
  first_name: '',
  last_name: '',
  gender: '',
  vegan: false,
  registered_allergy: false,
  registered_body_info: false,
  body_info: null,
};

export const useUserStore = create<UserStore>()(set => ({
  userInfo: defaultUserInfo, // 초기값 설정
  loading: true, // 로딩 상태 초기값
  setUserInfo: info => set({userInfo: info}),

  fetchUserInfo: async () => {
    try {
      set({loading: true}); // 로딩 시작
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
        loading: false, // 로딩 완료
      });
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);

      // 기본값으로 복구 및 로딩 종료
      set({
        userInfo: defaultUserInfo,
        loading: false,
      });
    }
  },

  updateAllergyStatus: status =>
    set(state => ({
      userInfo: state.userInfo ? {...state.userInfo, registered_allergy: status} : defaultUserInfo,
    })),

  updateBodyInfoStatus: status =>
    set(state => ({
      userInfo: state.userInfo
        ? {...state.userInfo, registered_body_info: status}
        : defaultUserInfo,
    })),
}));
