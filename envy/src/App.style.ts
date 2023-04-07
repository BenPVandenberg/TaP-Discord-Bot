import { styled } from '@mui/material';
import NavBar from 'components/NavBar';
import { darkTheme } from 'style/themes';

const navWidth = '110px';

export const PageWrapperSC = styled('div')(({ theme }) => ({
  display: 'flex',
  fontSize: '18px',
}));
export const NavBarSC = styled(NavBar)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: navWidth,
  height: '100vh',
  textAlign: 'center',
  background: 'rgba(0, 0, 0, 0.54)',
}));
export const ContentWrapperSC = styled('div')(({ theme }) => ({
  height: 'fit-content',
  padding: '2% 5% 25px 5%',
  margin: '20px 10px 20px 20px',
  width: '90%',
  borderRadius: '0.75rem',
  background: 'rgba(0, 0, 0, 0.54)',
  color: darkTheme.palette.getContrastText('rgba(0, 0, 0, 0.54)'),
}));
export const FooterSC = styled('p')(({ theme }) => ({
  paddingTop: '15px',
  color: 'grey',
  fontSize: 'small',
}));
