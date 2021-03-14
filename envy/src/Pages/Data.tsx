import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2";
import DataTable from "../Components/DataTable";

const useStyles = makeStyles((theme) => {
    return {
        wrapper: {
            textAlign: "center",
            margin: "auto",
        },
        title: {
            marginBottom: "20px",
        },
        textInput: {
            marginBottom: "20px",
            width: "50%",
            minWidth: "165px",
        },
        buttonGroup: {
            marginBottom: "20px",
        },
        dataTable: {
            margin: "auto",
            minWidth: "430px",
            maxWidth: "1000px",
        },
    };
});

interface GameLog {
    userID: number;
    username: string;
    game: string;
    start: Date;
    end: Date | null;
}

interface VoiceLog {
    userID: number;
    username: string;
    channel: string;
    start: Date;
    end: Date | null;
}

const gameLogCols = [
    {
        title: "Username",
        width: "20%",
        value: "username",
    },
    {
        title: "Game",
        width: "40%",
        value: "game",
    },
    {
        title: "Start",
        width: "20%",
        value: "start",
    },
    {
        title: "End",
        width: "20%",
        value: "end",
    },
];

const voiceLogCols = [
    {
        title: "Username",
        width: "20%",
        value: "username",
    },
    {
        title: "Channel",
        width: "15%",
        value: "game",
    },
    {
        title: "Start",
        width: "32.5%",
        value: "start",
    },
    {
        title: "End",
        width: "32.5%",
        value: "end",
    },
];

export default function Data() {
    const [tableView, setTableView] = useState<"game" | "voice">("game");
    const [userId, setUserId] = useState<string>("");
    const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
    const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);

    // this function will update the data on the visible table
    const fetchGameLogs = async () => {
        // verify we have a string
        if (!userId) return;

        const userIdNum: number = Number(userId);

        let inputType: "userID" | "username" = isNaN(userIdNum)
            ? "username"
            : "userID";

        // show loading
        Swal.fire({
            title: "Loading logs from server",
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
        });
        Swal.showLoading();

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
            (data) =>
                data.userID === userIdNum ||
                data.username.toLowerCase() === userId.toLowerCase(),
        );

        if (!downloadedData.length) {
            await Swal.fire({
                title: `No results for this ${inputType}`,
                icon: "error",
            });
        }

        setGameLogs(downloadedData);

        // stop loading
        Swal.close();
    };

    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <h1 className={classes.title}>Data Lookup</h1>
                <TextField
                    className={classes.textInput}
                    label="User ID or Username"
                    fullWidth
                    variant="outlined"
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    onKeyPress={(event) => {
                        if (event.key === "Enter") fetchGameLogs();
                    }}
                />
            {gameLogs.length ? (
                    <DataTable
                    gameLogs={gameLogs}
                    className={classes.dataTable}
                    ></DataTable>
            ) : null}
        </div>
    );
}
