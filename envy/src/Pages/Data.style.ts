import { styled, TextField, ToggleButtonGroup } from '@mui/material';

export const ContentSC = styled('div')(({ theme }) => ({
  textAlign: 'center',
  margin: 'auto',
}));

export const TitleSC = styled('h1')(({ theme }) => ({
  marginBottom: '20px',
}));

export const TextFieldSC = styled(TextField)(({ theme }) => ({
  marginBottom: '20px',
  width: '50%',
  minWidth: '165px',
}));

export const ToggleButtonGroupSC = styled(ToggleButtonGroup)(({ theme }) => ({
  marginBottom: '20px',
}));
