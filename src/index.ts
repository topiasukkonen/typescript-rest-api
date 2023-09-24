import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import axios from 'axios';
import sqlite3 from 'sqlite3';

const app = express();
app.use(express.json());

const db = new sqlite3.Database(':memory:');

// Create db table
db.run('CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, email TEXT, website TEXT, businessId TEXT, address TEXT, phone TEXT)');

// Defined routes
app.post('/customers', [
  body('name').isString(),
  body('email').optional().isEmail(),
  body('website').optional().isURL(),
  body('businessId').optional().isString(),
], async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, website, businessId } = req.body;

  let address = '';
  let phone = '';

  if (businessId) {
    try {
      // const response = await axios.get(`https://www.kauppalehti.fi/company-api/basic-info/${businessId}`);
      address = 'Test Address';
      phone = '+3581234567';
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: 'Invalid businessId' });
    }
  }

  db.run('INSERT INTO customers (name, email, website, businessId, address, phone) VALUES (?, ?, ?, ?, ?, ?)', [name, email, website, businessId, address, phone]);

  res.status(201).send();
});

app.get('/customers', (req: Request, res: Response) => {
  db.all('SELECT * FROM customers', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.get('/customers/:id', (req: Request, res: Response) => {
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

app.delete('/customers/:id', (req: Request, res: Response) => {
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
