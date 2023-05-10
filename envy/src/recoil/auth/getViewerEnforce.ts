import { selector } from 'recoil';
import atom from './atom';

export default selector({
  key: 'getViewerEnforce',
  get: ({ get }) => {
    const state = get(atom);
    if (state?.user) {
      return state.user;
    } else {
      throw Error('getViewerEnforce used with no viewer');
    }
  },
});
