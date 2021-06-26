import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DataTable, { Column } from "../Components/DataTable";
import SoundUpload from "../Components/SoundUpload";
import { useAppSelector } from "../store/hooks";
import { UserState } from "../types";

// used to prevent Swal popups when not on the page
let clientOnPage = true;

const useStyles = makeStyles((theme) => {
    return {
        wrapper: {
            textAlign: "center",
            margin: "auto",
        },
        pageHeader: {
            paddingBottom: "10px",
        },
        dataTable: {},
    };
});

type Sound = {
    name: string;
    occurrences: number;
    ownerID: number | null;
    ownerName: string | null;
    volume: number;
    hidden: boolean;
};

export default function Sounds() {
    const classes = useStyles();
    const user: UserState = useAppSelector((state) => state.user);
    const [allSounds, setAllSounds] = useState<Sound[]>([]);

    // gets the latest sound data from backend
    const updateSounds = async () => {
        if (!clientOnPage) return;

        let soundsSQL: Sound[] = []; // res responce

        // get /play statistics
        try {
            const response = await axios.get(
                process.env.REACT_APP_BACKEND_ADDRESS + "/sounds",
            );
            soundsSQL = response.data;
        } catch (err) {
            // possible that client left page, do a check
            if (!clientOnPage) return;

            const errorText = err.response
                ? err.response.data.msg || `HTTP Code ${err.response.status}`
                : `Cant reach ${err.config.url}`;

            Swal.fire({
                title: "Error with the server: GET /sounds",
                text: errorText,
                icon: "error",
            });
        }

        setAllSounds(soundsSQL);
    };

    // only signed in users can upload sounds
    const uploadButton = user.isLoggedIn ? <SoundUpload /> : "";

    useEffect(() => {
        // called on mount
        clientOnPage = true;
        updateSounds();

        // called on unmount
        return () => {
            clientOnPage = false;
            Swal.close();
        };
    }, []);

    const volumeOnChange = async (rowIndex: number, value: number) => {
        const newAllSounds = [...allSounds];
        newAllSounds[rowIndex].volume = value;
        setAllSounds(newAllSounds);

        // make the update on the backend
        const soundName = newAllSounds[rowIndex].name;
        await axios.put(
            process.env.REACT_APP_BACKEND_ADDRESS + "/sounds/" + soundName,
            { user: user.id, volume: value },
        );

        Swal.fire({
            toast: true,
            icon: "success",
            title: `Sound ${soundName} updated!`,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    };
    const hiddenOnChange = async (rowIndex: number, value: boolean) => {
        const newAllSounds = [...allSounds];
        newAllSounds[rowIndex].hidden = value;
        setAllSounds(newAllSounds);

        // make the update on the backend
        const soundName = newAllSounds[rowIndex].name;
        await axios.put(
            process.env.REACT_APP_BACKEND_ADDRESS + "/sounds/" + soundName,
            { user: user.id, hidden: value ? 1 : 0 },
        );

        Swal.fire({
            toast: true,
            icon: "success",
            title: `Sound ${soundName} updated!`,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    };

    const soundCols: Column[] = [
        {
            title: "Sound Name",
            value: "name",
        },
        {
            title: "# of plays",
            value: "occurrences",
        },
        {
            title: "Owner",
            value: "ownerName",
        },
    ];

    const soundAdminCols: Column[] = [
        {
            title: "Volume",
            value: "volume",
            colProps: { style: { width: "100%" } },
            inputType: "slider",
            inputProps: {
                min: 0,
                max: 3,
                step: 0.01,
                valueLabelDisplay: "auto",
            },
            onChange: volumeOnChange,
        },
        {
            title: "Hidden",
            value: "hidden",
            inputType: "checkbox",
            onChange: hiddenOnChange,
        },
    ];

    return (
        <div className={classes.wrapper}>
            <h1 className={classes.pageHeader}>Sounds</h1>
            <Grid container direction="row" justify="center" spacing={5}>
                <Grid item>
                    <DataTable
                        tableProps={{ className: classes.dataTable }}
                        columns={
                            user.isAdmin
                                ? [...soundCols, ...soundAdminCols]
                                : soundCols
                        }
                        rows={allSounds}
                    />
                </Grid>
                <Grid item>{uploadButton}</Grid>
            </Grid>
        </div>
    );
}
