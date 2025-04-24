const crypto = require('crypto'); 
// Import the 'crypto' module to handle encryption and decryption.

const secret = crypto.createHash('sha256').update('pppppppppppppppppppppppppppppppppp').digest();
// Hash the secret key using SHA-256 to ensure it is exactly 32 bytes (256 bits).

const encrypt = (password) => {
    const iv = crypto.randomBytes(16); 
    // Generate a random initialization vector (IV) for encryption. 
    // IV ensures that the same plaintext encrypts to different ciphertexts.

    const cipher = crypto.createCipheriv('aes-256-ctr', secret, iv); 
    // Create a cipher object using AES-256-CTR mode with the hashed secret key and IV.

    const encryptedPassword = Buffer.concat([
        cipher.update(password), 
        cipher.final()
    ]); 
    // Encrypt the password by processing it through the cipher and concatenating the result.

    return {
        iv: iv.toString('hex'), 
        // Convert the IV to a hexadecimal string for easier storage and transmission.

        password: encryptedPassword.toString('hex')
        // Convert the encrypted password to a hexadecimal string for easier storage and transmission.
    }; 
    // Return an object containing the IV and the encrypted password.
};

const decrypt = (encryptedPassword) => {
    const decipher = crypto.createDecipheriv(
        'aes-256-ctr', 
        secret, 
        Buffer.from(encryptedPassword.iv, 'hex')
    );
    // Create a decipher object using AES-256-CTR mode with the hashed secret key and the IV from the encrypted data.
    // This will be used to decrypt the encrypted password.

    const decryptedPassword = Buffer.concat([
        decipher.update(Buffer.from(encryptedPassword.password, 'hex')), 
        // Decrypt the encrypted password by converting it from a hexadecimal string to a buffer 
        // and processing it through the decipher object.

        decipher.final()
        // Finalize the decryption process and append any remaining decrypted data.
    ]);

    return decryptedPassword.toString();
    // Convert the decrypted password buffer to a string and return it.
    // This provides the original plaintext password.
};

module.exports = {encrypt, decrypt};
// Export the encrypt and decrypt functions so they can be used in other parts of the application.