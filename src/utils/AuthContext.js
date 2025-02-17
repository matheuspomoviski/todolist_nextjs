import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "./axiosConfig";
import { useRouter } from "next/router";

import styles from "../styles/PaginaInicial.module.css";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const router = useRouter(); // Use o hook do Next.js para navegação

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axiosInstance.get("/api/users/user");
                setUser(response.data); // Armazenar os dados do usuário
            } catch (error) {
                console.log(error);
                setUser(null); // Garantir que o usuário esteja como null em caso de erro
            } finally {
                setLoading(false);
            }
        };
        checkAuthStatus();
    }, []);

    // Função de login
    const login = async (email, password, action = "login") => {
        setLoading(true);
        const loginData = { email, password, action };
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 segundo de delay extra
            const response = await axiosInstance.post(
                "/api/users/user",
                loginData
            );
            if (response.status === 200) {
                setFormData({ email: "", password: "" }); // Limpar campos após sucesso
                setUser(response.data); // Armazenar os dados do usuário
                router.push("/PaginaInicial"); // Redirecionar para página após login bem-sucedido
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Função de logout
    const logout = () => {
        setUser(null); // Limpar o estado do usuário
        document.cookie = "token=; path=/"; // Limpar o cookie
        router.push("/Login"); // Redirecionar para página de login após logout
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
        // Mostrar o loading até a autenticação ser verificada
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
