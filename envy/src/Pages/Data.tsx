import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import DataTable, { Column } from "../Components/DataTable";
import { GameLog, VoiceLog } from "../types";
import { useAppSelector } from "../store/hooks";

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

const gameLogCols: Column[] = [
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

const voiceLogCols: Column[] = [
    {
        title: "Username",
        width: "20%",
        value: "username",
    },
    {
        title: "Channel",
        width: "20%",
        value: "channel",
    },
    {
        title: "Start",
        width: "30%",
        value: "start",
    },
    {
        title: "End",
        width: "30%",
        value: "end",
    },
];

export default function Data() {
    const user = useAppSelector((state) => state.user);
    const [tableView, setTableView] = useState<"game" | "voice">("game");
    const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
    const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);
    // if user is logged in, fill the box with their username
    const [userId, setUserId] = useState<string>(
        user.isLoggedIn ? user.username : "",
    );

    // this function will update the data on the visible table
    const fetchLogs = async () => {
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

        let gameDownloaded: GameLog[] = [];
        await axios
            .get(process.env.REACT_APP_BACKEND_ADDRESS + "/data/game")
            .then((res) => {
                gameDownloaded = res.data;
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

        let voiceDownloaded: VoiceLog[] = [];
        await axios
            .get(process.env.REACT_APP_BACKEND_ADDRESS + "/data/voice")
            .then((res) => {
                voiceDownloaded = res.data;
            })
            .catch((err) => {
                Swal.close();
                Swal.fire({
                    title: "Error with the server: GET /data/voice",
                    text:
                        err.response.data.msg ||
                        `HTTP Code ${err.response.status}`,
                    icon: "error",
                });
            });

        // filter the data
        gameDownloaded = gameDownloaded.filter(
            (data) =>
                data.userID === userIdNum ||
                data.username.toLowerCase() === userId.toLowerCase(),
        );

        voiceDownloaded = voiceDownloaded.filter(
            (data) =>
                data.userID === userIdNum ||
                data.username.toLowerCase() === userId.toLowerCase(),
        );

        if (!gameDownloaded.length && !voiceDownloaded.length) {
            await Swal.fire({
                title: `No results for this ${inputType}`,
                icon: "error",
            });
        }

        setGameLogs(gameDownloaded);
        setVoiceLogs(voiceDownloaded);

        // stop loading
        Swal.close();
    };

    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <h1 className={classes.title}>Data Lookup</h1>
            <div>
                <TextField
                    className={classes.textInput}
                    label="User ID or Username"
                    fullWidth
                    variant="outlined"
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                    onKeyPress={(event) => {
                        if (event.key === "Enter") fetchLogs();
                    }}
                />
            </div>
            <div>
                <ToggleButtonGroup
                    value={tableView}
                    className={classes.buttonGroup}
                    color="primary"
                    exclusive
                    onChange={(_event, newTableView) => {
                        setTableView(newTableView);
                    }}
                >
                    <ToggleButton value="game">Game</ToggleButton>
                    <ToggleButton value="voice">Voice</ToggleButton>
                </ToggleButtonGroup>
            </div>
            {gameLogs.length && tableView === "game" ? (
                <div>
                    <DataTable
                        table={{ className: classes.dataTable }}
                        columns={gameLogCols}
                        rows={gameLogs}
                    ></DataTable>
                </div>
            ) : null}
            {voiceLogs.length && tableView === "voice" ? (
                <div>
                    <DataTable
                        table={{ className: classes.dataTable }}
                        columns={voiceLogCols}
                        rows={voiceLogs}
                    ></DataTable>
                </div>
            ) : null}
        </div>
    );
}
