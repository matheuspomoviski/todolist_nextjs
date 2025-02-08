import conect from "../../../utils/db";

import Tasks from "../../../models/Tasks";
import tasksController from "../../../controllers/tasksController";

export default async function handler(req, res) {
    await conect();

    switch (req.method) {
      case "PUT":
        return tasksController.update(req, res);
      case "GET":
        return tasksController.get(req, res);
        case "DELETE":
        return tasksController.delete(req, res);
      default:
        return res.status(500).json({ Erro: "Método não aceito" });
    }
}