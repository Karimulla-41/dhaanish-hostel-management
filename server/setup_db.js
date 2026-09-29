import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSetup() {
  console.log('🔄 Executing MySQL Database Schema Setup...');
  
  // Connect to MySQL server
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'defaultdb',
    port: Number(process.env.DB_PORT) || 3306,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true
  });

  try {
    const sqlPath = path.join(__dirname, 'schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    await connection.query(sqlContent);
    console.log('✅ MySQL Database `dhaanish_hostel` & all 7 production tables successfully initialized!');
  } catch (err) {
    console.error('❌ Database schema execution error:', err.message);
  } finally {
    await connection.end();
  }
}

runSetup();
