const { encrypt } = require('./encryptionHandler');

const username = 'root';
const password = 'root';

const encrypted = encrypt(password);

console.log(`INSERT INTO users (user, password, iv) VALUES ('${username}', '${encrypted.password}', '${encrypted.iv}');`);