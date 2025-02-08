import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true });

let Users; // Declare a variável Users *fora* do bloco try...catch

try {
  Users = mongoose.model('Users'); // Tente obter o modelo existente
} catch (error) {
  if (error.name === 'MissingSchemaError') { // Verifique se o erro é por modelo não encontrado
    Users = mongoose.model('Users', userSchema, 'users'); // Crie o modelo se não existir
  } else {
    throw error; // Re-lança o erro se for diferente de MissingSchemaError
  }
}

export default Users; // Exporta a variável Users, que agora contém o modelo