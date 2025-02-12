import FormContainer from "../components/FormContainer";
import NavBar from "../components/NavBar";

import styles from "../styles/loadings.module.css";

import { useState, useEffect} from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Login = () => {
    const router = useRouter();

    // Estado para armazenar os dados do formulário
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    
    useEffect(() => {
        if(successMessage){
            const timer = setTimeout(() =>{
                router.push('/PaginaInicial')
                setLoading(false)
                setSuccessMessage(false)
            }, 3000)
            return () => clearInterval(timer);
        }
    }, [successMessage])
    

    //funcoes
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loginData = { ...formData, action: "login" };

        try {
            const response = await axios.post("/api/users/user", loginData);

            if (response.status === 200) {
                setFormData({
                    email: "",
                    password: "",
                });
                setSuccessMessage(true);    
            }
        } catch (error) {
            // Se a resposta foi recebida com erro
            if (error.response) {
                setLoading(false);
                setError(error.response.data.mensagem); // Exibindo a mensagem do erro da API
            }
        }
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
    ];
    return (
        <>
            <NavBar />
            <FormContainer
                inputs={inputs}
                titulo="Entre para adicionar e gerenciar suas tarefas"
                buttonLink={"Criar conta"}
                buttonText={"Entrar"}
                paragraphText={"Não tem uma conta?"}
                onSubmit={handleLogin}
                formData={formData}
                handleInputChange={handleInputChange}
                error={error}
                onButtonClick={() => {
                    router.push("/Register");
                }}
            />
            {loading && (
                <div className={styles.loading}>
                    Entrando...
                    <div className="d-flex justify-content-center align-itens-center mt-2">
                        <div className={styles["loading-spiner"]}></div>
                    </div>
                    {successMessage && (
                        <p>
                            Login realizado, redirecionando para a página
                            principal...
                        </p>
                    )}
                </div>
            )}
        </>
    );
};

export default Login;
