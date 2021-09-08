import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import DataTable, { Column } from "../Components/DataTable";
import { useAppSelector } from "../store/hooks";
import { GameLog, UserState, VoiceLog, TimeLog } from "../types";

// used to prevent Swal popups when not on the page
let clientOnPage = true;

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
        value: "username",
    },
    {
        title: "Game",
        value: "game",
    },
    {
        title: "Start",
        value: "start",
    },
    {
        title: "End",
        value: "end",
    },
];

const voiceLogCols: Column[] = [
    {
        title: "Username",
        value: "username",
    },
    {
        title: "Channel",
        value: "channel",
    },
    {
        title: "Start",
        value: "start",
    },
    {
        title: "End",
        value: "end",
    },
];

export default function Data() {
    const user: UserState = useAppSelector((state) => state.user);
    const [tableView, setTableView] = useState<"game" | "voice">("game");
    const [gameLogs, setGameLogs] = useState<GameLog[]>([]);
    const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);
    const [userId, setUserId] = useState<string>("");

    /**
     * This function will update the data on the visible table
     * @param user User's ID or username
     */
    const fetchLogs = async (user: string) => {
        // verify we have a string
        if (!user) return;
        if (!clientOnPage) return;
        let errorOccurred = false;

        // learn if we have a username or id
        const inputType: "userID" | "username" = isNaN(Number(user))
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
        let gameResponse: GameLog[] = [];
        let voiceResponse: VoiceLog[] = [];
        try {
            // if we got a username then find an id
            if (inputType === "username") {
                const searchResponse = await axios.get(
                    process.env.REACT_APP_BACKEND_ADDRESS + "/user/search",
                    { params: { username: user } }
                );

                user = searchResponse.data.userID;
            }

            // now with user id get the logs from the backend
            const response = await Promise.all([
                axios.get(
                    process.env.REACT_APP_BACKEND_ADDRESS + `/user/${user}/game`
                ),
                axios.get(
                    process.env.REACT_APP_BACKEND_ADDRESS +
                        `/user/${user}/voice`
                ),
            ]);
            gameResponse = response[0].data;
            voiceResponse = response[1].data;
        } catch (err) {
            // check if user still on page (may have left due to async)
            if (!clientOnPage) return;
            errorOccurred = true;

            const errorText: string = err.response
                ? err.response.data.msg || `HTTP Code ${err.response.status}`
                : `Cant reach ${err.config.url}`;

            // an error returned for one of the queries
            Swal.fire({
                title: `Error with the server`,
                text: errorText,
                icon: "error",
            });
        }

        const convertDataForDisplay = (log: TimeLog) => {
            const start = new Date(log.start);
            if (start) {
                log.start = start.toLocaleString();
            }
            if (log.end) {
                const end = new Date(log.end);
                if (end) {
                    log.end = end.toLocaleString();
                }
            }
        };

        // convert Start and End to date objects
        gameResponse.forEach(convertDataForDisplay);
        voiceResponse.forEach(convertDataForDisplay);

        setGameLogs(gameResponse);
        setVoiceLogs(voiceResponse);

        // stop loading
        if (!errorOccurred) Swal.close();

        // if no data on user
        if (!gameResponse.length && !voiceResponse.length && !errorOccurred) {
            Swal.fire({
                title: `No results for this ${inputType}`,
                icon: "error",
            });
        }
    };

    // if the user is logged in, set the box to their user name and fetch logs
    useEffect(() => {
        clientOnPage = true;
        // if logged in then the username is present
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setUserId(user.isLoggedIn ? user.username! : userId);

        if (user.isLoggedIn && user.id) {
            fetchLogs(user.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.isLoggedIn, user.id]);

    useEffect(() => {
        // called on mount
        clientOnPage = true;

        // called on unmount
        return () => {
            clientOnPage = false;
            Swal.close();
        };
    }, []);

    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            {/* header */}
            <h1 className={classes.title}>Data Lookup</h1>

            {/* username/userID input field */}
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

            {/* buttons to switch between voice and game logs view */}
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

            {/* game table view */}
            {gameLogs.length && tableView === "game" ? (
                <div>
                    <DataTable
                        tableProps={{ className: classes.dataTable }}
                        columns={gameLogCols}
                        rows={gameLogs}
                    ></DataTable>
                </div>
            ) : null}

            {/* voice table view */}
            {voiceLogs.length && tableView === "voice" ? (
                <div>
                    <DataTable
                        tableProps={{ className: classes.dataTable }}
                        columns={voiceLogCols}
                        rows={voiceLogs}
                    ></DataTable>
                </div>
            ) : null}
        </div>
    );
}
