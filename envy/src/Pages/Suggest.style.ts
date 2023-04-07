import { IconButton, styled } from '@mui/material';

export const ContentSC = styled('div')(({ theme }) => ({
  textAlign: 'center',
  margin: 'auto',
}));

export const GithubButtonSC = styled(IconButton)(({ theme }) => ({
  background: 'black',
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: '#5c5c5c',
  },
}));
