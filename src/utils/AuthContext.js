import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "./axiosConfig";
import { useRouter } from "next/router";
import styles from "../styles/PaginaInicial.module.css";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axiosInstance.get("/api/users/user");
                setUser (response.data);
            } catch (error) {
                console.log(error);
                setUser (null);
            } finally {
                setLoading(false); // Finaliza o loading independentemente do resultado
            }
        };

        checkAuthStatus();
    }, []);

    const login = async (formData) => {
        const loginData = { email: formData.email, password: formData.password, action: "login" };
        try {
            const response = await axiosInstance.post("/api/users/user", loginData);
            if (response.status === 200) {
                setUser (response.data.user);
                router.push("/PaginaInicial")
                return { success: true }; // Retorna sucesso

            } else {
                return { success: false, message: response.data.mensagem }; // Retorna mensagem de erro
            }
        } catch (error) {
            console.log(error);
            // Verifica se a resposta da API contém uma mensagem de erro
            if (error.response && error.response.data && error.response.data.mensagem) {
                return { success: false, message: error.response.data.mensagem }; // Retorna mensagem de erro específica da API
            } else {
                return { success: false, message: "Falha ao tentar fazer login. Verifique suas credenciais." };
            }
        }
    };

    const logout = async (action = "logout") => {
        try {
            await axiosInstance.post("/api/users/user", { action });
            setUser (null);
            router.push("/Login");
        } catch (error) {
            console.log("Erro ao fazer logout:", error);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <p>Carregando...</p>
                <div className="d-flex justify-content-center align-items-center mt-2">
                    <div className={styles["loading-spiner"]}></div>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext)
}