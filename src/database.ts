import mysql from 'promise-mysql';

import keys from './keys';

const pool = mysql.createPool(keys.database);

async function testConnection() {
    try {
        const connection = await (await pool).getConnection();
        connection.release(); // Correctly release the connection
        console.log('DB is Connected');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

// Call the function to test the connection
testConnection();

export default pool;