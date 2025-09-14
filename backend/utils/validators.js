const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?])(?=.{8,})/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPassword(p) {
  return passwordRegex.test(p);
}

function isValidEmail(e) {
  return emailRegex.test(e);
}

module.exports = { isValidPassword, isValidEmail };
