import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

type Sound = {
    name: string;
    occurrences: number;
    ownerID: number | null;
    ownerName: string;
};

const useStyles = makeStyles({
    table: {
        minWidth: "310px",
        maxWidth: "340px",
    },
});

// TODO With Auth, be able to determine if the user is the owner of a song
const isOwner = (song: string) => {
    return false;
};

// TODO With Auth, be able to determine if the user is an admin
const isAdmin = () => {
    return false;
};

export default function SoundTable(props: { sounds: Sound[] }) {
    const classes = useStyles();

    return (
        <TableContainer className={classes.table} component={Paper}>
            <Table size="small">
                <colgroup>
                    <col style={{ width: "50%" }} />
                    <col style={{ width: "15%" }} />
                    <col style={{ width: "20%" }} />
                    {/* <col style={{ width: '15%' }}/> */}
                </colgroup>
                <TableHead>
                    <TableRow>
                        <TableCell>Sound Name</TableCell>
                        <TableCell align="right"># of plays</TableCell>
                        <TableCell align="right">Owner</TableCell>
                        {/* <TableCell align="right">Actions</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.sounds.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell scope="row">{row.name}</TableCell>
                            <TableCell align="right">
                                {row.occurrences}
                            </TableCell>
                            <TableCell align="right">{row.ownerName}</TableCell>
                            {isOwner(row.name) || isAdmin() ? (
                                <TableCell align="right">Buttons</TableCell>
                            ) : null}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
