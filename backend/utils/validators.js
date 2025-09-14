const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;

function isValidPassword(p) {
  return passwordRegex.test(p);
}

module.exports = { isValidPassword };
// Password must be at least 8 characters long, contain at least one number and one special character
// Special characters allowed: !@#$%^&* 
