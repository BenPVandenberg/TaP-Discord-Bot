import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import React from "react";
import { MdCloudUpload } from "react-icons/md";
import Swal from "sweetalert2";
import { useAppSelector } from "../store/hooks";

const useStyles = makeStyles((theme) => {
    return {
        input: {
            display: "none",
        },
    };
});

// given a string will check if the sound name is valid
function isCorrectSoundName(name: string) {
    return (
        // max length of the sound name is 20
        name.length < 20 &&
        // no spaces
        !name.includes(" ") &&
        // only one dot
        name.includes(".") &&
        name.split(".").length === 2 &&
        // no special characters
        !/[^a-zA-Z0-9.]/.test(name)
    );
}

// TODO: make an interface for the T&P api
// will upload the provided sound to the backend and declare the owner
async function uploadSound(sound: File, ownerID: string) {
    const formData = new FormData();
    formData.append("file", sound);
    formData.append("user", ownerID);

    try {
        const response = await axios.post(
            process.env.REACT_APP_BACKEND_ADDRESS + "/sounds/upload",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        if (response.status === 201) {
            return true;
        } else {
            throw new Error(
                "Unknown Error Occurred, Please report this bug on the project's github page"
            );
        }
    } catch (error: any) {
        let errorMessage = "Unable to reach T&P API";
        if (error.response && error.response.data) {
            errorMessage = "API Error: ";
            errorMessage +=
                error.response.data.msg || error.response.statusText;
        }
        throw new Error(errorMessage);
    }
}

export default function SoundUpload() {
    const userID = useAppSelector((state) => state.user.id);

    /**
     * Called when a file is selected for upload
     * @param e Event that triggered the function call
     */
    const fileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // files could be null leading to index error
        if (e.target.files === null) return;
        const file = e.target.files[0];

        // verify sound name is correct
        const name = file.name.split(".")[0].toLowerCase();
        if (!isCorrectSoundName(file.name)) {
            Swal.fire({
                title: "Invalid Sound Name",
                text: "A sound name cannot contain a space",
            });
            return;
        }

        // open dialog with user to confirm upload
        const { isConfirmed } = await Swal.fire({
            title: `Create sound "${name}"?`,
            icon: "question",
            confirmButtonText: "Send It!",
            showDenyButton: true,
            reverseButtons: true,
        });

        if (isConfirmed) {
            // show loading screen while uploading sound
            Swal.fire({
                title: "Uploading...",
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
            });
            Swal.showLoading();

            try {
                // upload sound
                const uploadSuccessful = await uploadSound(file, userID);
                // successful upload
                if (uploadSuccessful) {
                    Swal.fire({
                        toast: true,
                        icon: "success",
                        title: `Sound ${name} uploaded!`,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 10000,
                        timerProgressBar: true,
                    });
                }
            } catch (error) {
                if (error instanceof Error) {
                    // server gave us error code
                    Swal.fire({
                        title: error.message,
                        icon: "error",
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

    const classes = useStyles();
    return (
        <div>
            <input
                accept=".mp3"
                id="sound-file"
                type="file"
                className={classes.input}
                onChange={fileSelected}
            />
            <label htmlFor="sound-file">
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<MdCloudUpload />}
                    component="span"
                >
                    Upload
                </Button>
            </label>
        </div>
    );
}
