import NavBar from "../components/NavBar";
import FormContainer from "../components/FormContainer";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosInstance from "../utils/axiosConfig";

import styles from "../styles/loadings.module.css";

const Register = () => {
    const router = useRouter();
    //states
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    //funcoes para eventos
    useEffect(() => {
        if(successMessage){
            const timer = setTimeout(() =>{
                router.push('/Login')
                setLoading(false)
                setSuccessMessage(false)
            },3000)
            return () => clearInterval(timer)
        }
    }, [successMessage])
    

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setError("");

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "password" || name === "confirmPassword") {
            if (formData.password === formData.confirmPassword) {
                setError("");
            }
        }
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não conferem");
            setLoading(false);
            return;
        }

        setError("");
        setLoading(true);
        setSuccessMessage("");

        const registerData = { ...formData, action: "create" };

        try {
            const response = await axiosInstance.post(
                "/api/users/user",
                registerData
            );
            setSuccessMessage(true)
        } catch (error) {
            if (error.response) {
                setError(error.response.data.mensagem);
                setLoading(false);
            }
            
        }
    };

    //array para os inputs
    const inputs = [
        {
            type: "text",
            placeholder: "Digite seu nome",
            label: "Nome",
            id: "name",
        },
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
        {
            type: "password",
            placeholder: "Confirme sua senha",
            label: "Digite a senha novamente",
            id: "confirmPassword",
        },
    ];

    return (
        <>
            <NavBar />
            <FormContainer
                inputs={inputs}
                titulo="Crie a sua conta para adicionar e gerenciar suas tarefas"
                buttonText="Cadastrar"
                buttonLink="Entrar"
                paragraphText="Já tem uma conta?"
                onSubmit={handleRegister}
                formData={formData}
                handleInputChange={handleInputChange}
                error={error}
                onButtonClick={() => {
                    router.push("/Login");
                }}
            />

            {loading && (
                <div className={styles.loading}>
                    Criando a sua conta...
                    <div className="d-flex justify-content-center align-itens-center mt-2">
                        <div className={styles["loading-spiner"]}></div>
                    </div>
                    {successMessage && (
                        <p>
                            Conta criada com sucesso, redirecionando para login
                        </p>
                    )}
                </div>
            )}
        </>
    );
};

export default Register;
