import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createPool } from 'mysql2/promise';

const app = express();

const pool = createPool({
  host: 'localhost',
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: 'internship',
});

app.get('/reviews', async (req, res) => {
    try {
      const sql = 'SELECT * FROM reviews';
      const [rows, fields] = await pool.execute(sql);
      res.json({ reviews: rows });

    } catch (err) {
      console.error('Error fetching reviews:', err);
      res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});  
  
app.get('/reviews/filter', async (req, res) => {

    const { appID, appStoreName, rating, countryName } = req.query;
    let sql = 'SELECT * FROM reviews WHERE 1=1';
    const params = [];
    
    if (appID) {
      sql += ' AND appID = ?';
      params.push(appID);
    }
    
    if (appStoreName) {
      sql += ' AND appStoreName = ?';
      params.push(appStoreName);
    }
    
    if (rating) {
      sql += ' AND rating = ?';
      params.push(parseInt(rating));
    }
    
    if (countryName) {
      sql += ' AND countryName = ?';
      params.push(countryName);
    }
    
    try {
      const [rows, fields] = await pool.execute(sql, params);
      res.json({ reviews: rows }); 
    } 
    
    catch (err) {
      console.error('Error filtering reviews:', err);
      res.status(500).json({ error: 'Failed to filter reviews' });
    }
});

app.get('/reviews/search', async (req, res) => {

    const { reviewHeading, reviewText } = req.query;
    let sql = 'SELECT * FROM reviews WHERE 1=1';
    const params = [];
  
    if (!reviewHeading && !reviewText) {
      return res.status(400).json({ error: 'Missing search query' });
    }
  
    if (reviewHeading) {
      sql += ' AND reviewHeading LIKE ?';
      params.push(`%${reviewHeading}%`);
    }
  
    if (reviewText) {
      sql += ' AND reviewText LIKE ?';
      params.push(`%${reviewText}%`);
    }
  
    try {
      const [rows, fields] = await pool.execute(sql, params);
      res.json({ reviews: rows });
    } 
    
    catch (err) {
      console.error('Error filtering reviews:', err);
      res.status(500).json({ error: 'Failed to filter reviews' });
    }
  });

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
})