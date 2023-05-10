import { selector } from 'recoil';
import atom from './atom';

export default selector({
  key: 'getViewer',
  get: ({ get }) => {
    const state = get(atom);
    return state?.user;
  },
});
