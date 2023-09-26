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
const express_validator_1 = require("express-validator");
const axios_1 = __importDefault(require("axios"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const db = new sqlite3_1.default.Database(':memory:');
// Create db table
db.run('CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, website TEXT, businessId TEXT, address TEXT, phone TEXT)');
// Defined routes
app.post('/customers', [
    (0, express_validator_1.body)('name').isString(),
    (0, express_validator_1.body)('email').optional().isEmail(),
    (0, express_validator_1.body)('website').optional().isURL(),
    (0, express_validator_1.body)('businessId').optional().isString(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, website, businessId } = req.body;
    let address = '';
    let phone = '';
    if (businessId) {
        try {
            const response = yield axios_1.default.get(`https://www.kauppalehti.fi/company-api/basic-info/${businessId}`);
            address = response.data.data.streetAddress;
            phone = '+358' + response.data.data.phone;
        }
        catch (error) {
            console.error(error);
            return res.status(400).json({ error: 'Invalid businessId' });
        }
        address = 'Test Address';
        phone = '+3581234567';
    }
    db.run('INSERT INTO customers (name, email, website, businessId, address, phone) VALUES (?, ?, ?, ?, ?, ?)', [name, email, website, businessId, address, phone]);
    res.status(201).send();
}));
app.get('/customers', (req, res) => {
    db.all('SELECT * FROM customers', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
    });
});
app.get('/customers/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM customers WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(row);
    });
});
app.delete('/customers/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM customers WHERE id = ?', [id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.status(204).send();
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
