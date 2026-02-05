const bcrypt = require('bcrypt');
const pool = require('./config/connection');

async function createAdmin() {
  try {
    const username = 'admin';
    const password = 'admin123'; // Change this to your desired password
    const fullName = 'System Administrator';

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert admin into database
    const [result] = await pool.query(
      `INSERT INTO admins (username, password_hash, full_name, is_active) 
       VALUES (?, ?, ?, TRUE)`,
      [username, passwordHash, fullName]
    );

    console.log('✅ Admin user created successfully!');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('ID:', result.insertId);
    console.log('\n⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('❌ Admin user already exists!');
      console.log('\nTo update the password, use this query:');
      
      const password = 'admin123'; // Change this
      const passwordHash = await bcrypt.hash(password, 10);
      
      console.log(`UPDATE admins SET password_hash = '${passwordHash}' WHERE username = 'admin';`);
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
    process.exit(1);
  }
}

createAdmin();