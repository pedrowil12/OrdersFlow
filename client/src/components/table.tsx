import { Card } from "@heroui/react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";

interface Column<T> {
    header: string;
    field?: keyof T;
    render?: (row: T) => React.ReactNode;
}

interface TableHeroProps<T> {
    columns: Column<T>[];
    data: T[];
}

export function TableHero<T>({ columns, data }: TableHeroProps<T>) {
    return (
        <Card className="p-4 w-full max-w-4xl overflow-x-auto">
            <Table>
                <TableHeader>
                    {columns.map((col, i) => (
                        <TableColumn key={i}>{col.header}</TableColumn>
                    ))}
                </TableHeader>
                <TableBody>
                    {data.map((row, idx) => (
                        <TableRow key={idx}>
                            {columns.map((col, i) => (
                                <TableCell key={i}>
                                    {col.render
                                        ? col.render(row)
                                        : col.field
                                            ? String(row[col.field] ?? "") // <- aqui garantimos ReactNode
                                            : null}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </Card>
    );
}
