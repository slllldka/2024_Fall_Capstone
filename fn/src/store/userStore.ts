import create from 'zustand';
import api from '../api/axiosConfig';

interface UserInfo {
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  vegan: boolean;
  registered_allergy: boolean;
}

interface UserStore {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
  fetchUserInfo: () => Promise<void>;
  updateAllergyStatus: (status: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),
  fetchUserInfo: async () => {
    try {
      const response = await api.get('/account/myinfo');
      set({ userInfo: response.data });
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
    }
  },
  updateAllergyStatus: (status) => 
    set((state) => ({
      userInfo: state.userInfo ? { ...state.userInfo, registered_allergy: status } : null
    })),
})); 