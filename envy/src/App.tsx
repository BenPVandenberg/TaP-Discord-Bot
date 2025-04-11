import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@mui/material';
import { ContentWrapperSC, FooterSC, NavBarSC, PageWrapperSC } from 'App.style';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import authState, { authGetViewer } from 'recoil/auth';
import { darkTheme } from 'style/themes';
import * as routeUtility from 'utilities/Routes';

export default function App() {
  const user = useRecoilValue(authGetViewer);
  const logout = useResetRecoilState(authState);

  // @ts-ignore: CSSStyleDeclaration
  document.body.style = `background: ${darkTheme.palette.background.default}`;

  const viewer = user
    ? {
        username: user.username,
        profilePicture:
          user.avatar ??
          new URL(
            'https://discord.com/assets/6f26ddd1bf59740c536d2274bb834a05.png'
          ),
      }
    : null;

  return (
    <ThemeProvider theme={darkTheme}>
      <PageWrapperSC>
        <NavBarSC
          logoSrc="/favicon-104x104.png"
          entries={routeUtility.getNavEntries()}
          viewer={viewer}
          onLogin={() => {
            window.location.href =
              process.env.REACT_APP_BACKEND_ADDRESS + '/auth/login';
          }}
          onLogout={logout}
        />
        <ContentWrapperSC>
          {routeUtility.getRoutes()}
          <FooterSC>
            {`© ${new Date().getFullYear()}. Made by Ben Vandenberg.`}
          </FooterSC>
        </ContentWrapperSC>
      </PageWrapperSC>
    </ThemeProvider>
  );
}
