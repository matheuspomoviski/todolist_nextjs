import mongoose from "mongoose";

const stringConexao = process.env.STRING_CONEXAO

export default async function conect() {
  try {
    await mongoose.connect(stringConexao)
    console.log("Conectado ao banco MongoDb", mongoose.connection.name)
  } catch (error) {
    console.log(error)
  }
}

