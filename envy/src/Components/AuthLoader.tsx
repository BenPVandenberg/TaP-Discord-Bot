import * as tokens from 'auth/AuthStorage';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import authState, { authGetViewer } from 'recoil/auth';

export default function AuthLoader() {
  const user = useRecoilValue(authGetViewer);
  const setVC = useSetRecoilState(authState);
  if (!user) {
    const parsedTokens = tokens.get();
    if (parsedTokens.accessToken && parsedTokens.refreshToken) {
      setVC({
        accessToken: parsedTokens.accessToken,
        refreshToken: parsedTokens.refreshToken,
      });
    }
  }
  return <></>;
}
