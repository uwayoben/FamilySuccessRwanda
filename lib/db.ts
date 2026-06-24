import mysql from 'mysql2/promise';

const g = global as typeof globalThis & { _mysqlPool?: mysql.Pool };

if (!g._mysqlPool) {
  g._mysqlPool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fsr_website',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
  });
}

export default g._mysqlPool as mysql.Pool;
