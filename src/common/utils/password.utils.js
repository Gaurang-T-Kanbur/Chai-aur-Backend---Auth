import bcrypt from "bcrypt";

class PasswordUtil {
  static async hash(password) {
   return bcrypt.hash(password, 10)
  }

  static async compare (password, dbPassword) {
    return await bcrypt.compare(password, dbPassword)
  }
}

export default PasswordUtil