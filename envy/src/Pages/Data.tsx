import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import axios from "axios";
import { useEffect, useState } from "react";
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
    const [userId, setUserId] = useState<string>("");

    // this function will update the data on the visible table
    const fetchLogs = async (user: string) => {
        // verify we have a string
        if (!user) return;

        const userNum: number = Number(user);

        let inputType: "userID" | "username" = isNaN(userNum)
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

        // run queries for game and voice data
        let gameResponce = { data: [] };
        let voiceResponce = { data: [] };
        try {
            const response = await Promise.all([
                axios.get(process.env.REACT_APP_BACKEND_ADDRESS + "/data/game"),
                axios.get(
                    process.env.REACT_APP_BACKEND_ADDRESS + "/data/voice",
                ),
            ]);
            gameResponce = response[0];
            voiceResponce = response[1];
        } catch (err) {
            // an error returned for one of the queries
            Swal.fire({
                title: `Error with the server: GET ${err.config.url}`,
                text: err.response
                    ? err.response.data.msg
                    : `HTTP Code ${err.response.status}`,
                icon: "error",
            });
            return;
        }

        // get + filter data for responses
        let gameDownloaded: GameLog[] = gameResponce.data;
        let voiceDownloaded: VoiceLog[] = voiceResponce.data;

        // filter the data
        gameDownloaded = gameDownloaded.filter(
            (data) =>
                data.userID === userNum ||
                data.username.toLowerCase() === user.toLowerCase(),
        );

        voiceDownloaded = voiceDownloaded.filter(
            (data) =>
                data.userID === userNum ||
                data.username.toLowerCase() === user.toLowerCase(),
        );

        // if no data on user
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

    // if the user is logged in set the box to their user name and fetch logs
    useEffect(() => {
        setUserId(user.isLoggedIn ? user.username : "");
        if (user.username !== "") {
            fetchLogs(user.username);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                        if (event.key === "Enter") fetchLogs(userId);
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
