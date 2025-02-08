import conect from "../../utils/db";

//controllers
import usersController from "../../controllers/usersController";

export default async function handler(req, res) {
    await conect();
    //rota principal
    if (req.method === "GET") {
        res.json({ mensagem: "O Servidor do next.js está ativo" });
    }
    if (req.method === "POST"){
      return usersController.create(req, res)
    }
}
