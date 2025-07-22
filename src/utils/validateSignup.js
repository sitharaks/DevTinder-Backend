const validator = require('validator');

const validateSignup = (data) => {
    const errors = {};
    const { firstName, lastName, email, password } = data.body;

    // Validate first name
    if (!firstName || firstName.trim() === '') {
        errors.firstName = 'First name is required';
    }

    // Validate last name
    if (!lastName || lastName.trim() === '') {
        errors.lastName = 'Last name is required';
    }

    if(!validator.isEmail(email)) {
        errors.email = 'Email is invalid';
    }
  
   if(!validator.isStrongPassword(password)) {
        errors.password = 'Password is not strong enough';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

module.exports = {validateSignup}