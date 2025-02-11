import tasksController from "../../../controllers/tasksController";
import conect from "../../../utils/db.js";

export default async function handler(req, res) {
    await conect();

    switch (req.method) {
        case "POST":
            return tasksController.create(req, res);
        case "GET":
            return tasksController.getTasks(req, res);
        default:
            return res.status(400).json({ Erro: "Método não permitido" });
    }
}
