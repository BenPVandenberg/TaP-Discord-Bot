import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DataTable from "../Components/DataTable";
import SoundUpload from "../Components/SoundUpload";
import { useAppSelector } from "../store/hooks";
import { UserState } from "../types";

const useStyles = makeStyles((theme) => {
    return {
        wrapper: {
            textAlign: "center",
            margin: "auto",
        },
        pageHeader: {
            paddingBottom: "10px",
        },
        dataTable: {
            minWidth: "310px",
            maxWidth: "340px",
        },
    };
});

type Sound = {
    name: string;
    occurrences: number;
    ownerID: number | null;
    ownerName: string | null;
};

const soundCols = [
    {
        title: "Sound Name",
        width: "50%",
        value: "name",
    },
    {
        title: "# of plays",
        width: "15%",
        value: "occurrences",
    },
    {
        title: "Owner",
        width: "20%",
        value: "ownerName",
    },
];

export default function Sounds() {
    const classes = useStyles();
    const user: UserState = useAppSelector((state) => state.user);
    const [allSounds, setAllSounds] = useState<Sound[]>([]);

    const updateSounds = async () => {
        let soundsSQL: Sound[] = []; // res responce

        // get /play statistics
        await axios
            .get(process.env.REACT_APP_BACKEND_ADDRESS + "/sounds")
            .then((res) => {
                soundsSQL = res.data;
            })
            .catch((err) => {
                const errorText = err.response
                    ? err.response.data.msg ||
                      `HTTP Code ${err.response.status}`
                    : `Cant reach ${err.config.url}`;

                Swal.fire({
                    title: "Error with the server: GET /sounds",
                    text: errorText,
                    icon: "error",
                });
            });

        // sort by highest frequency
        soundsSQL.sort((a, b) => b.occurrences - a.occurrences);

        setAllSounds(soundsSQL);
    };

    // only signed in users can upload sounds
    const uploadButton = user.isLoggedIn ? <SoundUpload /> : "";

    // run on mount
    useEffect(() => {
        updateSounds();
    }, []); // * This empty array makes useEffect act like componentDidMount

    return (
        <div className={classes.wrapper}>
            <h1 className={classes.pageHeader}>Sounds</h1>
            <Grid container direction="row" justify="center" spacing={5}>
                <Grid item>
                    <DataTable
                        table={{ className: classes.dataTable }}
                        columns={soundCols}
                        rows={allSounds}
                    />
                </Grid>
                <Grid item>{uploadButton}</Grid>
            </Grid>
        </div>
    );
}
