import bcrypt from 'bcryptjs';

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10)
            .then((salt) => {
                bcrypt.hash(password, salt)
                    .then((hash) => resolve(hash))
                    .catch((error) => reject(error));
            })
            .catch((error) => reject(error));
    });
};

export const comparePassword = (password, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword)
            .then((result) => resolve(result))
            .catch((error) => reject(error));
    });
};
