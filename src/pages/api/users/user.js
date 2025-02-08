import conect from "../../../utils/db";
import usersController from "../../../controllers/usersController";

export default async function handler(req, res) {
    await conect();

    if (req.method === "POST") {
        const { action } = req.body;

        switch (action) {
            case "create":
                return usersController.create(req, res);
            case "login":
                return usersController.login(req, res);
            //caso seja enviado ações inválidas
            default:
                return res.status(400).json({ Erro: "Ação inválida" });
        }
    } else {
        //resposta para outros métodos que não seja POST
        return res.status(405).json({ Erro: "Método não permitido" });
    }
}
