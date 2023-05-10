import User from 'classes/User';
import { atom, DefaultValue } from 'recoil';
import * as auth from 'auth';
import * as tokens from 'auth/AuthStorage';

type AuthState = {
  accessToken: string;
  refreshToken: string;
  user?: User;
};

export default atom<AuthState | null>({
  key: 'auth',
  default: null,
  effects: [
    ({ setSelf, onSet }) => {
      onSet(async (newValue, oldValue, isReset) => {
        if (isReset && oldValue && !(oldValue instanceof DefaultValue)) {
          auth.logOutUser(oldValue.accessToken);
          tokens.clear();
        } else if (newValue && !newValue.user) {
          const user = await auth.logInUser(
            newValue.accessToken,
            newValue.refreshToken
          );
          setSelf(user ? { ...newValue, user } : null);
        }
      });
    },
  ],
});
