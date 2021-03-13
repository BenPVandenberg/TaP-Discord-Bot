import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Swal from "sweetalert2";
import axios from "axios";
import DataTable from "../Components/DataTable";

const useStyles = makeStyles((theme) => {
    return {
        wrapper: {
            textAlign: "center",
            margin: "auto",
        },
        title: {},
    };
});

interface GameLog {
    userID: number;
    username: string;
    game: string;
    start: Date;
    end: Date | null;
}

export default function Suggest() {
    const [userId, setUserId] = useState<string>("");
    const [gameLogs, setGameLogs] = useState<GameLog[]>([]);

    // this function will update the data on the visible table
    const fetchGameLogs = async () => {
        // verify we have a string
        if (!userId) return;

        const userIdNum: number = Number(userId);
        console.log({ userIdNum });

        // verify the input is a number
        if (isNaN(userIdNum)) {
            Swal.fire({
                title: "UserID isn't a number",
                icon: "error",
            });
            return;
        }

        let downloadedData: GameLog[] = [];
        await axios
            .get("https://api.tandp.me/data/game")
            .then((res) => {
                downloadedData = res.data;
            })
            .catch((err) => {
                Swal.fire({
                    title: "Error with the server: GET /data/game",
                    text:
                        err.response.data.msg ||
                        `HTTP Code ${err.response.status}`,
                    icon: "error",
                });
            });

        // filter the data
        downloadedData = downloadedData.filter(
            (data) => data.userID === userIdNum,
        );

        setGameLogs(downloadedData);
    };

    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <h1 className={classes.title}>Data Lookup</h1>
            <TextField
                label="User ID"
                fullWidth
                variant="outlined"
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
                onKeyPress={(event) => {
                    if (event.key === "Enter") fetchGameLogs();
                }}
            />
            {gameLogs.length ? (
                <DataTable gameLogs={gameLogs}></DataTable>
            ) : null}
        </div>
    );
}
