import bcrypt from "bcryptjs";

class Hash {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(value) {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return await bcrypt.hash(value, salt);
  }

  static async compare(value, hashedValue) {
    return await bcrypt.compare(value, hashedValue);
  }
}

export { Hash };

// regitaration
// const passwordHasher = new Hash(12);
// const hashedPassword = await passwordHasher.hash("myPassword");

// login
// const isMatch = await Hash.compare("myPassword", user.password);
// if (!isMatch) {
//   return res.status(401).json({ message: "Invalid credentials" });
// }
