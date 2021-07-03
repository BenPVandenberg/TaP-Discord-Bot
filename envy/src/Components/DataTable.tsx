import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Slider from "@material-ui/core/Slider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { useEffect, useState } from "react";

export interface TableProps {
    className: string;
}

export interface Column {
    title: string;
    value: string;
    colProps?: any;
    // following used for input fields
    inputType?: "checkbox" | "slider";
    inputProps?: any;
    // required for any input type
    onChange?: (rowIndex: number, value: any) => void;
}

export default function GameLogTable(props: {
    tableProps: TableProps;
    columns: Column[];
    rows: any[];
}) {
    // have a local rows storage for better performance with high refresh inputs (slider)
    const [localRowsStorage, setLocalRowsStorage] = useState<any[]>(props.rows);

    /**
     * Function to render a cell based on the column + row info
     * @param column
     * @param value
     * @param rowIndex Index of the row in the rows prop
     * @returns HTML to be rendered
     */
    const renderCell = (column: Column, value: any, rowIndex: number) => {
        switch (column.inputType) {
            // render cell based on its type
            case "checkbox":
                // onchange is required
                if (!column.onChange) break;
                return (
                    <Checkbox
                        checked={value}
                        {...column.inputProps}
                        onChange={(e, checked) => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            column.onChange(rowIndex, checked);
                        }}
                        size="small"
                    />
                );
            case "slider":
                // onchange is required
                if (!column.onChange) break;
                return (
                    <Slider
                        value={value}
                        {...column.inputProps}
                        onChangeCommitted={(e, newValue) => {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            column.onChange(rowIndex, newValue);
                        }}
                        onChange={(e, newValue) => {
                            // update the local storage of rows
                            const newLocalRowsStorage = [...localRowsStorage];
                            newLocalRowsStorage[rowIndex][column.value] =
                                newValue;
                            setLocalRowsStorage(newLocalRowsStorage);
                        }}
                    />
                );
            default:
                break;
        }
        // here if we just want to display value or onChange isn't provided
        return value;
    };

    // required for setting local rows storage
    useEffect(() => {
        setLocalRowsStorage(props.rows);
    }, [props.rows]);

    return (
        <TableContainer {...props.tableProps} component={Paper}>
            <Table size="small">
                {/* set colgroup for every column */}
                <colgroup>
                    {props.columns.map((col, index) => (
                        <col key={index} {...col.colProps} />
                    ))}
                </colgroup>

                {/* put column titles at top */}
                <TableHead>
                    <TableRow>
                        {props.columns.map((col, index) => (
                            <TableCell key={index}>{col.title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                {/* fill data top to bottom, left to right */}
                <TableBody>
                    {localRowsStorage.map((row, index) => (
                        // every row
                        <TableRow key={index}>
                            {props.columns.map((col, index2) => (
                                // every column in row
                                <TableCell key={index2}>
                                    {renderCell(col, row[col.value], index)}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
