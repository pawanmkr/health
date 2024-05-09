import Excel from 'exceljs';

export async function extractColumns(sheet_path: string) {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(sheet_path);
    const worksheet = workbook.worksheets[0];

    const rows_arr: any = [];
    const headers: any = {};

    worksheet.eachRow((row, row_number) => {
        if (row_number === 1) {
            row.eachCell((cell, cell_number) => {
                headers[cell_number] = cell.toString();
            });
        } else {
            const json_row: any = {};
            row.eachCell((cell, cell_number) => {
                json_row[headers[cell_number]] = cell.toString();
            });
            rows_arr.push(json_row);
        }
    });
    return {
        headers,
        rows: rows_arr
    };
}