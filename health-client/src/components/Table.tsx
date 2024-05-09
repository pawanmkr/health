import { Table } from '@mantine/core';
import _ from "lodash";
import { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';


interface TableProps {
    columns: string[];
    rows: unknown[];
}


// TODO: use typescript generics to define the type of the row later
export default function TableComponent(props: TableProps) {
    const { columns, rows } = props;

    const rowKeys = rows.map(() => uuidv4());

    const rs = rows.map((row: unknown, index: number) => (
        <Table.Tr key={rowKeys[index]}>
            {_.values(row).map((value: unknown, i: number) => (
                <Table.Td key={i}>{value as ReactNode}</Table.Td>
            ))}
        </Table.Tr>
    ));

    return (
        <Table striped highlightOnHover withTableBorder withColumnBorders className='mt-16'>
            <Table.Thead>
                <Table.Tr>
                    {columns.map((column: string) => (
                        <Table.Th key={column}>{column}</Table.Th>
                    ))}
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rs}</Table.Tbody>
        </Table>
    );
}
