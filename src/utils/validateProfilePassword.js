const validator = require('validator');

const validateProfilePassword = (req) => {
    const allowedFieldToEdit = ['password'];
    const isEditable = Object.keys(req.body).every((key) => allowedFieldToEdit.includes(key));
    if (!isEditable) {
        throw new Error('Invalid fields for password change request - only password can be changed');
    }
    if (!req.body.password || !validator.isLength(req.body.password, { min: 6 })) {
        throw new Error('Password must be at least 6 characters long');
    }
    return validator.isStrongPassword(req.body.password) && isEditable;
}

module.exports = validateProfilePassword;