import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DataTable from "../Components/DataTable";
import SoundUpload from "../Components/SoundUpload";

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
    ownerName: string;
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
    const [allSounds, setAllSounds] = useState<Sound[]>([]);

    const updateSounds = async () => {
        const newAllSounds: Sound[] = [];
        let soundsSQL: Sound[] = []; // res responce
        let soundList: string[] = [];

        // get /play statistics
        await axios
            .get(process.env.REACT_APP_BACKEND_ADDRESS + "/data/play")
            .then((res) => {
                soundsSQL = res.data;
            })
            .catch((err) => {
                Swal.fire({
                    title: "Error with the server: GET /data/play",
                    text:
                        err.response.data.msg ||
                        `HTTP Code ${err.response.status}`,
                    icon: "error",
                });
            });

        // get all available sounds
        await axios
            .get(process.env.REACT_APP_BACKEND_ADDRESS + "/sounds")
            .then((res) => {
                soundList = res.data;
            })
            .catch((err) => {
                Swal.fire({
                    title: "Error with the server: GET /sounds",
                    text:
                        err.response.data.msg ||
                        `HTTP Code ${err.response.status}`,
                    icon: "error",
                });
            });

        // if we have data for a song then update allSounds
        soundList.forEach((sound) => {
            sound = sound.slice(0, -4);

            const soundData = soundsSQL.find((el) => el.name === sound);

            if (soundData === undefined) {
                newAllSounds.push({
                    name: sound,
                    occurrences: 0,
                    ownerID: null,
                    ownerName: "",
                });
            } else {
                newAllSounds.push({
                    name: sound,
                    occurrences: soundData.occurrences,
                    ownerID: soundData.ownerID,
                    ownerName: soundData.ownerName,
                });
            }
        });

        // sort by highest frequency
        newAllSounds.sort((a, b) => b.occurrences - a.occurrences);

        setAllSounds(newAllSounds);
    };

    // run on mount
    useEffect(() => {
        updateSounds();
    }, []); // * This empty array makes useEffect act like componentDidMount

    const classes = useStyles();

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
                <Grid item>
                    <SoundUpload />
                </Grid>
            </Grid>
        </div>
    );
}
