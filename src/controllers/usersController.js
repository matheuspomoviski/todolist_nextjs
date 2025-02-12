import {serialize} from "cookie"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/Users";
import validateToken from "../utils/validateToken";

const usersController = {
    // Criar usuário
    create: async (req, res) => {
        if (req.method !== "POST") {
            return res.status(405).json({ mensagem: "Método não permitido" });
        }

        try {
            const { name, email, password } = req.body;

            // Validações
            if (!name) return res.status(422).json({ mensagem: "O nome é obrigatório" });
            if (!email) return res.status(422).json({ mensagem: "O email é obrigatório" });
            if (!password) return res.status(422).json({ mensagem: "A senha é obrigatória" });

            const userExist = await Users.findOne({ email });
            if (userExist) {
                return res.status(422).json({ mensagem: "Já existe um usuário cadastrado com esse email" });
            }

            // Hash da senha
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);

            const user = new Users({ name, email, password: passwordHashed });

            await user.save();
            return res.status(201).json({ mensagem: "Usuário criado com sucesso", user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro ao registrar o usuário" });
        }
    },

    // Login do usuário
    login: async (req, res) => {
        if (req.method !== "POST") {
            return res.status(405).json({ mensagem: "Método não permitido" });
        }

        try {
            const { email, password } = req.body;

            if (!email) return res.status(422).json({ mensagem: "O email é obrigatório" });
            if (!password) return res.status(422).json({ mensagem: "A senha é obrigatória" });

            // Buscar usuário no banco de dados
            const userExist = await Users.findOne({ email });
            if (!userExist) return res.status(404).json({ mensagem: "Usuário não encontrado" });

            // Validar senha
            const isPasswordValid = await bcrypt.compare(password, userExist.password);
            if (!isPasswordValid) return res.status(400).json({ mensagem: "Senha inválida" });

            // Criar token JWT
            const secret = process.env.SECRET;
            const acessToken = jwt.sign({ id: userExist.id }, secret, { expiresIn: "1h" });

            // Criar cookie
            res.setHeader("Set-Cookie", serialize("acessToken", acessToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
                path: "/",
                maxAge: 60 * 60, // 1 hora
            }));

            return res.status(200).json({ mensagem: "Autenticação realizada com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro na autenticação do usuário" });
        }
    },

    // Validar token
    validate: async (req, res) => {
        try {
            const token = req.cookies.acessToken; // Pega o token diretamente dos cookies

            if (!token) {
                return res.status(401).json({ mensagem: "Token não encontrado" });
            }
            const isValidateToken = await validateToken(token);
            if (!isValidateToken) {
                return res.status(403).json({ mensagem: "Autenticação negada" });
            }
            const user = await Users.findById(isValidateToken.id).select("-password")

            if(!user){
                return res.status(404).json({mensagem: "Usuário não encontrado"})
            }
            return res.status(200).json({ mensagem: "Acesso permitido", user});
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro na validação do token" });
        }
    },

    // Excluir usuário
    delete: async (req, res) => {
        if (req.method !== "DELETE") {
            return res.status(405).json({ mensagem: "Método não permitido" });
        }

        try {
            const { id } = req.query;

            // Verifica se o usuário existe
            const user = await Users.findById(id);
            if (!user) return res.status(404).json({ mensagem: "Usuário não encontrado" });

            await Users.findByIdAndDelete(id);
            return res.status(200).json({ mensagem: "Usuário excluído com sucesso" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ mensagem: "Erro ao excluir usuário" });
        }
    },
};

export default usersController;