import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";

import formatDate from "../utils/formatData";
import styles from "../styles/PaginaInicial.module.css";

const PaginaInicial = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        date: "",
    });
    const [loginDate] = useState(formatDate());
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const userData = async () => {
            try {
                const response = await axiosInstance.get("/api/users/user");
                const { name, email, _id: userId } = response.data.user;
                setUser({ name, email, userId });
            } catch (error) {
                console.error("Erro ao carregar dados do usuário:", error);
                if (error.response && error.response.status === 401) {
                    router.push("/Login");
                }
            } finally {
                setLoading(false);
            }
        };
        userData();
    }, []);

    const fetchTasks = async () => {
        if (!user || !user.userId) return;
        try {
            const response = await axiosInstance.get("/api/tasks/task", {
                params: { userId: user.userId }
            });

            if (Array.isArray(response.data) || (response.data && Array.isArray(response.data.tasks))) {
                const tasksData = Array.isArray(response.data) ? response.data : response.data.tasks;

                const formattedTasks = tasksData.map(task => ({
                    ...task,
                    date: task.date ? new Date(task.date).toLocaleDateString('pt-BR') : ""
                }));

                setTasks(formattedTasks);
            } else {
                console.error("Resposta da API inválida:", response.data);
                setTasks([]);
            }
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
            setTasks([]);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user?.userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const handleCreate = async (e) => {
        e.preventDefault();

        try {
            if (!user || !user.userId) {
                console.error("Usuário não autenticado.");
                return;
            }

            const taskData = { ...newTask, userId: user.userId };
            const response = await axiosInstance.post("/api/tasks/task", taskData);
            console.log("Tarefa criada:", response.data);

            if (response.status === 201) {
                setNewTask({ title: "", date: "" }); // Limpa o formulário
                await fetchTasks(); // Recarrega as tarefas
            } else {
                console.error("Erro ao criar tarefa:", response.data);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
        }
    };

    if (isLoading) {
        return (
            <>
                <NavBar />
                <div className={styles.loading}>
                    <p>Carregando...</p>
                    <div className="d-flex justify-content-center align-items-center mt-2">
                        <div className={styles["loading-spiner"]}></div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <div className="w-100 mt-5 d-flex flex-column justify-content-center align-items-center">
                <h1>Olá, bem-vindo {user?.name}</h1>
                <form onSubmit={handleCreate} className="form-floating mb-4">
                    <h2 className="fs-4 mt-4 text-center">
                        Adicione novas tarefas:
                    </h2>
                    <div className=" bg-secondary p-3 rounded-3">
                        <label className={styles.label} htmlFor="title">
                            Título da tarefa:
                        </label>
                        <input className={styles.input} type="text" name="title" id="title"
                            placeholder="Participar da reunião..."
                            required
                            value={newTask.title}
                            onChange={handleChange}
                        />
                        <label className={styles.label} htmlFor="date">
                            Prazo limite para conclusão:
                        </label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            min={loginDate}
                            required
                            value={newTask.date}
                            className={styles.date}
                            onChange={handleChange}
                        />
                        <button
                            className={styles.button}
                            type="submit"
                        >
                            Criar tarefa
                        </button>
                    </div>
                </form>

                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        task && task.title ? (
                            <div key={task._id || task.id || `task-${Math.random()}`} className={styles.tasksCard}>
                                <p>{task.title}</p>
                                <p>prazo: {task.date}</p>
                                <button className={styles.btnPen}>
                                    <FontAwesomeIcon icon={faPen} />
                                </button>
                                <button className={styles.btnXmark}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                                <button className={styles.btnCheck}>
                                    <FontAwesomeIcon icon={faCheck} />
                                </button>
                            </div>
                        ) : null
                    ))
                ) : (
                    <p className="text-body-tertiary">Nenhuma tarefa adicionada ainda</p>
                )}
            </div>
        </>
    );
};

export default PaginaInicial;