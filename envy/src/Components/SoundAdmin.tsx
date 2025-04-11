import SendIcon from '@mui/icons-material/Send';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Avatar,
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  styled,
  TextField,
} from '@mui/material';
import Sound from 'classes/Sound';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type Props = {
  sound: Sound;
  onSubmit: () => void | Promise<void>;
  maxVolume: number;
};

type State = {
  volume: number;
  isHidden: boolean;
};

const HeaderSC = styled('h2')(({ theme }) => ({
  textAlign: 'center',
}));

export default function SoundAdmin({ sound, onSubmit, maxVolume }: Props) {
  const [values, setValues] = useState<State>({
    volume: 1,
    isHidden: false,
  });

  const volumeTooLoud = useMemo(() => {
    return values.volume > maxVolume;
  }, [values.volume, maxVolume]);

  const onReset = useCallback(() => {
    sound.clearChanges();
    setValues({
      volume: sound.volume,
      isHidden: sound.hidden,
    });
  }, [sound]);

  useEffect(() => {
    onReset();
    return onReset;
  }, [onReset, sound]);

  const volumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.abs(Number(event.target.value));
    sound.volume = value;
    setValues({ ...values, volume: value });
  };
  const hiddenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    sound.hidden = value;
    setValues({ ...values, isHidden: value });
  };

  return (
    <>
      <HeaderSC>Admin</HeaderSC>

      <List sx={{ width: '100%', maxWidth: 360 }}>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <VolumeUpIcon />
            </Avatar>
          </ListItemAvatar>
          <TextField
            label="Volume"
            variant="outlined"
            type="number"
            value={values.volume}
            onChange={volumeChange}
            focused={volumeTooLoud}
            color={volumeTooLoud ? 'warning' : 'primary'}
            helperText={
              volumeTooLoud ? 'Volume above 3 is highly discouraged' : null
            }
            FormHelperTextProps={{ color: '#28a745' }}
          />
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <VisibilityOffIcon />
            </Avatar>
          </ListItemAvatar>
          <FormControlLabel
            control={
              <Checkbox checked={values.isHidden} onChange={hiddenChange} />
            }
            label="Hide from sounds list?"
          />
        </ListItem>
        {sound.isModified() && (
          <ListItem>
            <Button
              variant="contained"
              endIcon={<SendIcon />}
              onClick={onSubmit}
              style={{ marginRight: 10 }}
            >
              Update
            </Button>
            <Button
              variant="contained"
              endIcon={<RefreshIcon />}
              onClick={onReset}
              color="secondary"
            >
              Reset
            </Button>
          </ListItem>
        )}
      </List>
    </>
  );
}
