import conect from "../../../utils/db";
import usersController from "../../../controllers/usersController";

export default async function handler(req, res) {
    try {
        await conect(); // Conectar ao banco

        if (req.method === "POST") {
            const { action } = req.body;

            switch (action) {
                case "create":
                    return usersController.create(req, res);
                case "login":
                    return usersController.login(req, res);
                default:
                    return res.status(400).json({ Erro: "Ação inválida" });
            }
        } else if (req.method === "GET") {
            return usersController.validate(req, res);
        } else {
            // Resposta para outros métodos que não sejam POST
            return res.status(405).json({ Erro: "Método não permitido" });
        }
    } catch (error) {
        return res.status(500).json({ Erro: "Erro interno do servidor" });
    }
}
