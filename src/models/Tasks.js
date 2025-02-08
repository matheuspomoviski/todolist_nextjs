import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
}, { timestamps: true });

let Tasks; // Declare a variável Tasks *fora* do bloco try...catch

try {
  Tasks = mongoose.model('Tasks'); // Tente obter o modelo existente
} catch (error) {
  if (error.name === 'MissingSchemaError') { // Verifique se o erro é por modelo não encontrado
    Tasks = mongoose.model('Tasks', taskSchema, 'tasks'); // Crie o modelo se não existir
  } else {
    throw error; // Re-lança o erro se for diferente de MissingSchemaError
  }
}

export default Tasks; // Exporta a variável Tasks, que agora contém o modelo