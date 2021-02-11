import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import React from 'react';
import { MdCloudUpload } from 'react-icons/md';
import Swal from 'sweetalert2';

const useStyles = makeStyles({
    input: {
        display: 'none',
    },
});

const isCorrectSoundName = (name) => {
    // name valid if no spaces
    return name.indexOf(' ') === -1;
};

// eslint-disable-next-line no-unused-vars
const uploadSound = async (sound) => {
    const formData = new FormData();
    formData.append('file', sound);

    return await axios
        .post('http://52.152.174.99:5000/sounds/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            return error;
        });
};

export default function SoundUpload() {
    // called when a file is selected for upload
    const fileSelected = async (e) => {
        const file = e.target.files[0];
        if (file === undefined) return;

        // verify sound name is correct
        const name = file.name.split('.')[0].toLowerCase();
        if (!isCorrectSoundName(name)) {
            Swal.fire({
                title: 'Invalid Sound Name',
                text: 'A sound name cannot contain a space',
            });
            return;
        }

        // open dialog with user to confirm upload
        await Swal.fire({
            title: `Create sound "${name}"?`,
            icon: 'question',
            confirmButtonText: 'Send It!',
            showDenyButton: true,
            reverseButtons: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                // show loading screen while uploading sound
                Swal.fire({
                    title: 'Uploading...',
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    willClose: () => {
                        Swal.hideLoading();
                    },
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                });

                // upload sound
                uploadSound(file).then((res) => {
                    // close the loading screen
                    Swal.close();
                    // successful upload
                    if (res.status === 201) {
                        console.log(res);
                        Swal.fire({
                            toast: true,
                            icon: 'success',
                            title: `Sound ${res.data.msg} Uploaded`,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 10000,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.hideLoading();
                            },
                        });
                    }
                    // server gave us error code
                    else if (res.response !== undefined) {
                        Swal.fire({
                            title:
                                res.response.data.msg ||
                                `Error code ${res.status}: ${res.statusText}`,
                            icon: 'error',
                        });
                    }
                    // sever error (unable to reach)
                    else {
                        Swal.fire({
                            title: 'Unable to reach server',
                            icon: 'error',
                            didOpen: () => {
                                Swal.hideLoading();
                            },
                        });
                        console.error(res.stack);
                    }
                });
            } else {
                // FIXME if u cancel a upload and go to redo it, you must refresh. (Due to onChange)
                // temp fix
                window.location.reload();
            }
        });
    };

    const classes = useStyles();
    return (
        <div>
            <input
                accept='.mp3'
                id='sound-file'
                type='file'
                className={classes.input}
                onChange={fileSelected}
            />
            <label htmlFor='sound-file'>
                <Button
                    variant='contained'
                    color="secondary"
                    startIcon={<MdCloudUpload />}
                    component='span'
                >
                    Upload
                </Button>
            </label>
        </div>
    );
}
