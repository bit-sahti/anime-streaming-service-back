const bcrypt = require('bcrypt');

class PasswordManager {
    encrypt = password => {
        const salt = bcrypt.genSaltSync(10);

        return bcrypt.hashSync(password, salt);
    }

    decrypt = (password, encryptedPassword) => bcrypt.compareSync(password, encryptedPassword);
}

module.exports = new PasswordManager();