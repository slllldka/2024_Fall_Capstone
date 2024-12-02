import {create} from 'zustand';

type BodyInfoState = {
  hasBodyInfo: boolean;
  setHasBodyInfo: (value: boolean) => void;
};

const useBodyInfoStore = create<BodyInfoState>((set) => ({
  hasBodyInfo: false,
  setHasBodyInfo: (value) => set({hasBodyInfo: value}),
}));

export default useBodyInfoStore;
