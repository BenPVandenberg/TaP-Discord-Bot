import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";

interface GameLog {
    userID: number;
    username: string;
    game: string;
    start: Date;
    end: Date | null;
}

const useStyles = makeStyles((theme) => {
    return {
        table: {
            width: "75%",
            minWidth: "430px",
            maxWidth: "975px",
        },
    };
});

export default function SoundTable(props: { gameLogs: GameLog[] }) {
    const classes = useStyles();

    return (
        <TableContainer className={classes.table} component={Paper}>
            <Table size="small">
                <colgroup>
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "40%" }} />
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "20%" }} />
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Game</TableCell>
                        <TableCell>Start</TableCell>
                        <TableCell>End</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.gameLogs.slice(0, 50).map((row, index) => (
                        <TableRow key={index}>
                            <TableCell scope="row">{row.username}</TableCell>
                            <TableCell>{row.game}</TableCell>
                            <TableCell>{row.start}</TableCell>
                            <TableCell>{row.end}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
