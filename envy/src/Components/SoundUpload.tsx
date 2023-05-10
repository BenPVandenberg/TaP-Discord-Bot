import { Button, styled, Theme } from '@mui/material';
import Sound from 'classes/Sound';
import User from 'classes/User';
import { TStyledProps } from 'constants/Types';
import React from 'react';
import { MdCloudUpload } from 'react-icons/md';
import Swal from 'sweetalert2';

const InputSC = styled('input')(({ theme }) => ({
  display: 'none',
}));

// given a string will check if the sound name is valid
function isCorrectSoundName(name: string) {
  return (
    // max length of the sound name is 20
    name.length < 20 &&
    // no spaces
    !name.includes(' ') &&
    // only one dot
    name.includes('.') &&
    name.split('.').length === 2 &&
    // no special characters
    !/[^a-zA-Z0-9.]/.test(name)
  );
}

export type Props = {
  viewer: User;
  themeSwal: Theme;
};

export default function SoundUpload(props: Props & TStyledProps) {
  /**
   * Called when a file is selected for upload
   * @param e Event that triggered the function call
   */
  const fileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // files could be null leading to index error
    if (e.target.files === null) return;
    const file = e.target.files[0];

    // verify sound name is correct
    const name = file.name.split('.')[0].toLowerCase();
    if (!isCorrectSoundName(file.name)) {
      Swal.fire({
        title: 'Invalid Sound Name',
        text: 'A sound name cannot contain a space',
        icon: 'error',
        confirmButtonColor: props.themeSwal.palette.primary.main,
      });
      return;
    }

    // open dialog with user to confirm upload
    const { isConfirmed } = await Swal.fire({
      title: `Create sound "${name}"?`,
      icon: 'question',
      confirmButtonText: 'Send It!',
      showDenyButton: true,
      reverseButtons: true,
    });

    if (isConfirmed) {
      // show loading screen while uploading sound
      Swal.fire({
        title: 'Uploading...',
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      Swal.showLoading();

      try {
        // upload sound
        await Sound.genFromFile(file, props.viewer);

        // successful upload
        Swal.fire({
          toast: true,
          icon: 'success',
          title: `Sound ${name} uploaded!`,
          position: 'top-end',
          showConfirmButton: false,
          timer: 10000,
          timerProgressBar: true,
        });
      } catch (error) {
        if (error instanceof Error) {
          // server gave us error code
          Swal.fire({
            title: error.message,
            icon: 'error',
            confirmButtonColor: props.themeSwal.palette.primary.main,
          });
        } else {
          // only expecting Error objects, if not, something unexpected went wrong
          throw error;
        }
      }
    } else {
      window.location.reload();
    }
  };

  return (
    <div className={props.className}>
      <InputSC
        accept=".mp3"
        id="sound-file"
        type="file"
        onChange={fileSelected}
      />
      <label htmlFor="sound-file">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<MdCloudUpload />}
          component="span"
        >
          Upload New Sound
        </Button>
      </label>
    </div>
  );
}
