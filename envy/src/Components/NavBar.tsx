import { styled } from '@mui/material';
import { TStyledProps } from 'constants/Types';
import { IconType } from 'react-icons';
import { BiLogIn, BiLogOut } from 'react-icons/bi/';
import { Link, To } from 'react-router-dom';

const AppLogoSC = styled('img')(({ theme }) => ({
  height: '85.688px',
  width: '90%',
  marginTop: '20px',
  marginBottom: '15px',
  borderRadius: '25%',
  alignSelf: 'center',
}));
const LinkSC = styled(Link)(({ theme }) => ({
  textDecoration: 'none',
}));
const NavEntrySC = styled('div')(({ theme }) => ({
  padding: '10px 0px',
  color: theme.palette.getContrastText('#1b1e21'),
  '&:hover': {
    background: theme.palette.primary.main,
    color: theme.palette.getContrastText(theme.palette.primary.main),
    cursor: 'pointer',
  },
}));
const NavEntryTextSC = styled('p')(({ theme }) => ({
  margin: '0',
}));
const ProfileNavEntrySC = styled('div')(({ theme }) => ({
  marginTop: 'auto',
  color: theme.palette.getContrastText('#1b1e21'),
}));
const ProfilePictureSC = styled('img')(({ theme }) => ({
  borderRadius: '50%',
  height: '55px',
}));
const UsernameSC = styled('p')(({ theme }) => ({
  marginTop: 0,
  marginBottom: 10,
}));

export type Props = {
  logoSrc: string;
  entries: NavEntryType[];
  viewer: {
    username: string;
    profilePicture: URL;
  } | null;
  onLogin?: () => void;
  onLogout?: () => void;
};

export type NavEntryType = {
  label: string;
  href: To;
  icon: IconType;
};

export default function NavBar({
  logoSrc,
  entries,
  viewer,
  onLogin,
  onLogout,
  className,
}: Props & TStyledProps) {
  const loginButton = onLogin ? (
    <NavEntrySC onClick={onLogin}>
      <BiLogIn size={35} />
      <NavEntryTextSC>Log In</NavEntryTextSC>
    </NavEntrySC>
  ) : null;
  const logoutButton = onLogout ? (
    <NavEntrySC onClick={onLogout}>
      <BiLogOut size={35} />
      <NavEntryTextSC>Log Out</NavEntryTextSC>
    </NavEntrySC>
  ) : null;

  const accountButton = viewer ? logoutButton : loginButton;

  return (
    <div className={className}>
      <AppLogoSC src={logoSrc} alt="logo" />

      {entries.map((entry) => {
        return (
          <LinkSC to={entry.href} key={entry.label}>
            <NavEntrySC>
              <entry.icon size={30} />
              <NavEntryTextSC>{entry.label}</NavEntryTextSC>
            </NavEntrySC>
          </LinkSC>
        );
      })}

      {accountButton}

      {viewer && (
        <ProfileNavEntrySC>
          <ProfilePictureSC
            src={viewer.profilePicture.href}
            alt="profile picture"
          />
          <UsernameSC>{viewer.username}</UsernameSC>
        </ProfileNavEntrySC>
      )}
    </div>
  );
}
