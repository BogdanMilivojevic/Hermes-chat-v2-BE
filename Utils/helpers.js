const bcrypt = require('bcrypt')

const checkPassword = async function (loginPassword, dbPassword) {
  return await bcrypt.compare(loginPassword, dbPassword)
}

module.exports = checkPassword
