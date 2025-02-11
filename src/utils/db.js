// utils/db.js
import mongoose from 'mongoose';

const conect = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(process.env.STRING_CONEXAO);
};

export default conect;
