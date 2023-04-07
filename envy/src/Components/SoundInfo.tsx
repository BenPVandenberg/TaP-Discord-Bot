import NumbersIcon from '@mui/icons-material/Numbers';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
} from '@mui/material';
import Sound from 'classes/Sound';

const HeaderSC = styled('h2')(({ theme }) => ({
  textAlign: 'center',
}));

export type Props = {
  sound: Sound;
};

export default function SoundInfo({ sound }: Props) {
  return (
    <>
      <HeaderSC>Info</HeaderSC>

      <List sx={{ width: '100%', maxWidth: 360 }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <BadgeIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={sound.name} />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <NumbersIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={`${sound.occurrences} times played`} />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={`${sound.ownerName}`} />
        </ListItem>
      </List>
    </>
  );
}
