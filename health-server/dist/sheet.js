"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractColumns = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
function extractColumns(sheet_path) {
    return __awaiter(this, void 0, void 0, function* () {
        const workbook = new exceljs_1.default.Workbook();
        yield workbook.xlsx.readFile(sheet_path);
        const worksheet = workbook.worksheets[0];
        const rows_arr = [];
        const headers = {};
        worksheet.eachRow((row, row_number) => {
            if (row_number === 1) {
                row.eachCell((cell, cell_number) => {
                    headers[cell_number] = cell.toString();
                });
            }
            else {
                const json_row = {};
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
    });
}
exports.extractColumns = extractColumns;
