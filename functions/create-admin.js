const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// This function will be called on first deployment to create the admin user
async function createAdminUser() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined');
    return false;
  }

  try {
    console.log('Checking if admin user exists...');
    
    // Connect to the database
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    
    // Check if the users table exists
    const tableResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const tableExists = tableResult.rows[0].exists;
    
    if (!tableExists) {
      console.log('Users table does not exist. Please run database migrations first.');
      await pool.end();
      return false;
    }
    
    // Check if admin user already exists
    const result = await pool.query(`
      SELECT * FROM users WHERE username = 'admin' LIMIT 1;
    `);
    
    if (result.rows.length > 0) {
      console.log('Admin user already exists');
      await pool.end();
      return true;
    }
    
    // Create admin user if it doesn't exist
    console.log('Creating admin user...');
    
    // Hash the password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert the admin user
    await pool.query(`
      INSERT INTO users (username, password, email, role, created_at, updated_at)
      VALUES ('admin', $1, 'admin@example.com', 'admin', NOW(), NOW());
    `, [hashedPassword]);
    
    console.log('Admin user created successfully');
    await pool.end();
    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return false;
  }
}

module.exports = { createAdminUser };