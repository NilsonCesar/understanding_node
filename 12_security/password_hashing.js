const crypto = require('node:crypto');

const salt = crypto.randomBytes(32);

function hashPassword(password) {
    const iterations = 10000;

    return crypto.pbkdf2Sync(password, salt, iterations, 32, 'sha256');
}

function verifyPassword(password, originalHashedPassword) {
    const hashedPassword = hashPassword(password);
    console.log(hashedPassword, originalHashedPassword);
    return crypto.timingSafeEqual(hashedPassword, originalHashedPassword);
}

const password = 'uepaaa';

const originalHashedPassword = hashPassword(password);

console.log(verifyPassword(password, originalHashedPassword));