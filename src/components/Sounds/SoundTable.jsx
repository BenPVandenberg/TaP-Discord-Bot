import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    table: {
        width: '40%',
        textAlign: 'center'
    },
});

const isOwner = (song) => {
    return false;
};

const isAdmin = () => {
    return false;
};

export default function SoundTable(props) {
    const classes = useStyles();

    return (
        <TableContainer className={classes.table} component={Paper}>
            <Table size="small">
                <colgroup>
                    <col style={{ width: '50%' }}/>
                    <col style={{ width: '15%' }}/>
                    <col style={{ width: '20%' }}/>
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
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.occurrences}</TableCell>
                            <TableCell align="right">{row.ownerName}</TableCell>
                            {isOwner(row.name) || isAdmin() ?
                                <TableCell align="right">Buttons</TableCell> : null
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
