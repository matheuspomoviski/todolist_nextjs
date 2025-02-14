import mongoose from "mongoose";
import Task from "../models/Tasks.js";

const tasksController = {
    //create task | no MongoDb o userId será a chave para busca das tarefas de um usuário, na coleção 'tasks' o _id referencia o id da task e não do usuário
    create: async (req, res) => {
        try {
            //nesse caso não precisa de rota dinâmica pois a tarefa é criada pelo usuário logado e nisso o front-end ja envia o id do usuário
            const { title, date, userId } = req.body;

            if (!title) {
                res.status(422).json({
                    mensagem: "O título é obrigatório para criar uma tarefa",
                });
            }
            if (!date) {
                res.status(422).json({
                    mensagem: "A data é obrigatória para criar uma tarefa",
                });
            }
            const task = new Task({
                title,
                date,
                userId,
            });

            try {
                await task.save();
                res.status(201).json(
                    {
                        mensagem: "Tarefa criada com sucesso",
                    }
                );
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    message:
                        "Houve um problema ao tentar salvar a tarefa no banco de dados",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Houve um erro ao receber as informações da tarefa",
            });
        }
    },
    getTasks: async (req, res) => {
      try {
        const userId = req.query.userId;
        console.log(userId)
        const tasks = await Task.find({ userId });
    
        if (tasks.length === 0) { // Corrigido para verificar se o array está vazio
          return res.status(200).json({ tasks: [] }); // Adicione o return aqui
        }
    
        res.status(200).json(tasks);
      } catch (error) {
        console.log(error);
        res.status(500).json({ mensagem: "Houve um erro ao tentar consultar as tarefas desse usuário" });
      }
    },
    update: async (req, res) => {
      try {
        //resgatando dados da requisição
      const taskId = req.query.taskId
      const {
        title,
        date,
        status
      } = req.body
      //encontrando a tarefa que sera atualizada
      const taskExist = await Task.findById(taskId)
      if(!taskExist){
        return res.status(404).json({mensagem: "Tarefa não encontrada"})
      }
      //atualizando a tarefa
      const task = {title, date, status}
      try {
        const taskUpdated = await Task.findByIdAndUpdate(taskId, task)
        res.status(200).json({mensagem: "Tarefa atualizada com sucesso"})
      } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Houve um erro ao tentar atualizar a tarefa"})
      }
      } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Houve um erro ao receber os dados da tarefa"})
      }
      
    },
    //get unico para roteamento das paginas no front end
    get: async (req, res) => {
      try {
        const taskId = req.query.taskId
        const taskExist = await Task.findById(taskId)
        if(!taskExist){
          res.status(404).json({mensagem: "Tarefa não encontrada"})
        }
        res.status(200).json(taskExist)
      } catch (error) {
        res.status(500).json({mensagem: "Houve um erro ao tentar buscar a tarefa"})
      }
    },
    delete: async (req, res) => {
      try {
        const taskId = req.query.taskId
          const taskExist = await Task.findById(taskId)
          if(!taskExist){
            res.status(404).json({mensagem: "Tarefa não encontrada"})
          }
        const taskDeleted = await Task.findByIdAndDelete(taskId)
        res.status(200).json({mensagem: "Tarefa deletada com sucesso"})
      } catch (error) {
        res.status(500).json({mensagem: "Houve um erro ao tentar deletar a tarefa"})
      }
    }
};

export default tasksController;
