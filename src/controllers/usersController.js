//imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
//model
import Users from "../models/Users";
import mongoose from "mongoose";

import validateToken from "../utils/validateToken";

//CRUD e LOGIN Users
const usersController = {
    //Create User
    create: async (req, res) => {
        try {
            //coletando valores da requisição
            const { name, email, password } = req.body;

            //validações para não ter cadastro com mesmo email
            if (!name) {
                res.status(422).json({
                    mensagem: "O nome é obrigatório para registro",
                });
            }
            if (!email) {
                res.status(422).json({
                    mensagem: "O email é obrigatório para registro",
                });
            }
            if (!password) {
                res.status(422).json({
                    mensagem: "A senha é obrigatória para registro",
                });
            }

            const userExist = await Users.findOne({ email: email });
            if (userExist) {
                return res.status(422).json({
                    mensagem: "Já existe um usuário cadastrado com o email:",
                    email,
                });
            }
            // criptografia da senha
            const salt = await bcrypt.genSalt(2);
            const passwordHashed = await bcrypt.hash(password, salt);

            const user = new Users({
                name,
                email,
                password: passwordHashed,
            });
            //criação no banco de dados
            try {
                await user.save();
                res.status(201).json({
                    mensagem: "Usuário criado com sucesso",
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    mensagem:
                        "Houve um erro ao tentar criar o perfil do usuário no banco de dados",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                mensagem: "Não foi possível registrar o usuário",
            });
        }
    },
    //Login usuario
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            if (!email) {
                res.status(422).json({
                    mensagem: "O email é obrigatório para registro",
                });
            }
            if (!password) {
                res.status(422).json({
                    mensagem: "A senha é obrigatória para registro",
                });
            }
            //validando se o usuário existe
            const userExist = await Users.findOne({ email: email });
            if (!userExist) {
                return res.status(422).json({
                    mensagem: "Já existe um usuário cadastrado com o email:",
                    email,
                });
            }

            //validação de senha
            const validatePassword = bcrypt.compare(
                password,
                userExist.password
            );

            if (!validatePassword) {
                res.status(400).json({ Erro: "As senhas não conferem" });
            }
            //criacao do token jwt
            try {
                const secret = process.env.SECRET;
                const acessToken = jwt.sign(
                    {
                        id: userExist.id,
                    },
                    secret,
                    { expiresIn: "1h" }
                );

                res.status(201).json({
                    mensagem: "Autenticação realizada com sucesso",
                    acessToken: acessToken,
                    userId: userExist.id,
                    name: userExist.name,
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({
                    Erro: "Houve um erro na autenticação do usuário",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({
                Erro: "Houve um erro ao tentar fazer o login do usuário",
            });
            console.log(error);
        }
    },
    //validacao token
    validate: async (req, res) => {
        const id = req.query.id;
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        //verificar se existe o usuário
        try {
            const user = await Users.findById(id, "-password");

            const isValidateToken = await validateToken(token);
            console.log(isValidateToken);
            if (!isValidateToken || !user) {
                res.status(404).json({
                    Erro: "Usuário não encontrado, autenticação negada",
                });
            }
            res.json({ user });
        } catch (error) {
            console.log(error);
        }
    },
    delete: async (req, res) => {
        const id = req.query.id;
        //verificando se existe esse id
        const user = await Users.findById(id);

        if (!user) {
            res.status(404).json({ Erro: "Usuário não encontrado" });
        }

        try {
            const deletedUser = await Users.findByIdAndDelete(id);

            res.status(200).json({
                deletedUser,
                mensagem: "Usuário excluído com sucesso ",
            });
        } catch (error) {
            console.log(error);
        }
    },
};

export default usersController;
