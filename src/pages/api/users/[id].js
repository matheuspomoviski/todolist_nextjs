import conect from "../../../utils/db";

import Users from "../../../models/Users";

import usersController from "../../../controllers/usersController";


export default async function handler(req, res, token) {
  await conect();
  if(req.method === "GET"){
    return usersController.validate(req, res)
  } else if(req.method === "DELETE"){
    return usersController.delete(req, res)
  } else{
    return res.status(500).json({Erro: "Método não aceito"})
  }
}