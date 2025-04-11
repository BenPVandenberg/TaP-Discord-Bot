import { Card, Grid, styled } from '@mui/material';

export const ContentGridSC = styled(Grid)(({ theme }) => ({
  display: 'flex',
}));

export const DetailCardSC = styled(Card)(({ theme }) => ({
  padding: '10px',
}));

export const PageHeaderSC = styled('h1')(({ theme }) => ({
  paddingBottom: '10px',
  textAlign: 'center',
}));
