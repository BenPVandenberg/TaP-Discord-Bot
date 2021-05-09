import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export interface TableProps {
    className: string;
}

export interface Column {
    title: string;
    width: string;
    value: string;
}

export default function GameLogTable(props: {
    table: TableProps;
    columns: Column[];
    rows: any[];
}) {
    return (
        <TableContainer className={props.table.className} component={Paper}>
            <Table size="small">
                <colgroup>
                    {props.columns.map((col, index) => (
                        <col key={index} style={{ width: col.width }} />
                    ))}
                </colgroup>
                <TableHead>
                    <TableRow>
                        {props.columns.map((col, index) => (
                            <TableCell key={index}>{col.title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.rows.map((row, index) => (
                        <TableRow key={index}>
                            {props.columns.map((col, index2) => (
                                <TableCell key={index2}>
                                    {row[col.value]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
