import FormContainer from "../components/FormContainer";
import NavBar from "../components/NavBar";

import { useState, useEffect} from "react";
import { useRouter } from "next/router";
import { useAuth } from "../utils/AuthContext";
import axiosInstance from "../utils/axiosConfig"; // Adicionando a importação para axiosInstance

const Login = () => {
    const router = useRouter();
    const { login } = useAuth(); // Só estamos consumindo o estado 'user' do contexto
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (successMessage) {
            router.push("/PaginaInicial");
            setSuccessMessage(false);
        }
    }, [successMessage]);
    

    // Função de login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true); // Inicia o estado de carregamento
    
        const result = await login(formData); // Chama a função de login do contexto
    
        if (result.success) {
            setFormData({ email: "", password: "" }); // Limpar campos após sucesso
            router.push("/PaginaInicial"); // Redireciona diretamente após login
        } else {
            setError(result.message); // Define a mensagem de erro retornada pela função de login
        }
    
        setLoading(false); // Finaliza o estado de carregamento
    };
    
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        setError("");
    };

    const inputs = [
        {
            type: "email",
            placeholder: "Digite seu email",
            label: "Email",
            id: "email",
        },
        {
            type: "password",
            placeholder: "Digite sua senha",
            label: "Senha",
            id: "password",
        },
    ]

    return (
        <>
            <NavBar showLogout={false} />
            <FormContainer
                inputs={inputs}
                titulo="Entre para adicionar e gerenciar suas tarefas"
                buttonLink={"Criar conta"}
                buttonText={loading ? "Carregando..." : "Entrar"} // Alterando o texto do botão durante o carregamento
                paragraphText={"Não tem uma conta?"}
                onSubmit={handleLogin}
                formData={formData}
                handleInputChange={handleInputChange}
                error={error}
                onButtonClick={() => {
                    router.push("/Register")
                }}
            />
        </>
    );
};

export default Login;
