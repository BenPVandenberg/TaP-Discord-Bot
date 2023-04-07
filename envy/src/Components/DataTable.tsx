import {
  Checkbox,
  Paper,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';

export type TableProps = {
  className: string;
};

export type Column = {
  title: string;
  value: string;
  colProps?: any;
  // following used for input fields
  inputType?: 'checkbox' | 'slider';
  inputProps?: any;
  // required for any input type
  onChange?: (rowIndex: number, value: any) => void;
};

export default function GameLogTable(props: {
  columns: Column[];
  rows: any[];
  xStyle?: TableProps;
}) {
  // have a local rows storage for better performance with high refresh inputs (slider)
  const [localRowsStorage, setLocalRowsStorage] = useState<any[]>(props.rows);

  /**
   * Function to render a cell based on the column + row info
   */
  const renderCell = (column: Column, value: any, rowIndex: number) => {
    switch (column.inputType) {
      // render cell based on its type
      case 'checkbox':
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
      case 'slider':
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
              newLocalRowsStorage[rowIndex][column.value] = newValue;
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
    <TableContainer {...props.xStyle} component={Paper}>
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
