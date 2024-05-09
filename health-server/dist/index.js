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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const sheet_1 = require("./sheet");
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const crypto_1 = __importDefault(require("crypto"));
const app = (0, express_1.default)();
const upload = (0, multer_1.default)({ dest: "uploads/" });
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(6007, () => {
    console.log('Server is running on port 6007');
});
app
    .get('/health', (req, res) => {
    res.send('OK');
})
    .post('/upload', upload.any(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files)
        console.error("file not uploaded");
    if (Array.isArray(req.files) && req.files.length > 0) {
        const output = yield (0, sheet_1.extractColumns)(req.files[0].path);
        console.log(output.headers);
        console.log(output.rows.length + " rows");
        // TODO: generate a unique id for the file and save file in blob storage with this id
        const file_id = crypto_1.default.randomBytes(16).toString('hex');
        res.json({
            headers: output.headers,
            rows: output.rows,
            file_id
        });
    }
}))
    .post('/columns/selected', (req, res) => {
    console.log(req.body);
    res.send('OK');
});
