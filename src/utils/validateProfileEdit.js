const validateProfileEdit = (req) => {
   const isAllowedToEdit = [
        'firstName',
        'lastName', 
        'email',
        'bio',
        'skills',
        'photoUrl'
   ]
   const isEditable = Object.keys(req.body).every((key) => isAllowedToEdit.includes(key));

   if (!isEditable) {
       throw new Error('Invalid profile fields');
   }
   return isEditable
}

module.exports = validateProfileEdit;