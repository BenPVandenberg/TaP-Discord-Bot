import { styled } from '@mui/material';

export const ContentSC = styled('div')(({ theme }) => ({
  // Following need to be specified to center correctly
  textAlign: 'center',
  margin: 'auto',
  // end of required values
  width: '75%',
}));
