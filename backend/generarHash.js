// generarHash.js
import bcrypt from "bcryptjs";

const password = "admin123";

const generarHash = async () => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log("Contraseña:", password);
  console.log("Hash bcrypt:", hash);
};

generarHash();
