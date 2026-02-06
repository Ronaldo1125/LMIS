const bcrypt = require('bcrypt');
const pool = require('./config/connection');

async function createAdmin() {
  try {
    const username = 'admin';
    const password = 'admin123'; // CHANGE THIS
    const fullName = 'System Administrator';
    const role = 'admin';

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.query(
      `
      INSERT INTO adminpanel_users
      (username, password_hash, full_name, role, is_active)
      VALUES (?, ?, ?, ?, TRUE)
      `,
      [username, passwordHash, fullName, role]
    );

    console.log('✅ Admin user created successfully!');
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Role:', role);
    console.log('ID:', result.insertId);
    console.log('\n⚠️  Change the password after first login.');

    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('❌ Admin user already exists.');

      const password = 'admin123'; // CHANGE THIS
      const passwordHash = await bcrypt.hash(password, 10);

      console.log('\nTo reset password manually, run:');
      console.log(`
UPDATE adminpanel_users
SET password_hash = '${passwordHash}'
WHERE username = 'admin' AND role = 'admin';
      `);
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
    process.exit(1);
  }
}

createAdmin();