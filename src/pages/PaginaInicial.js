import { useState, useEffect, useRef } from "react";
import axiosInstance from "../utils/axiosConfig";
import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import { useTask } from "../utils/ContextApi";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faXmark, faCheck } from "@fortawesome/free-solid-svg-icons";

import formatDate from "../utils/formatData";
import styles from "../styles/PaginaInicial.module.css";

const PaginaInicial = () => {
    const router = useRouter();
    const { setTaskToEdit } = useTask();
    const taskIdToRemove = useRef(null);

    // States
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: "",
        date: "",
    });
    const [taskRemove, setTaskRemove] = useState(null);
    const [loginDate] = useState(formatDate());
    const [isLoading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState(false);
    const [isDisable, setIsDisable] = useState(false);
    const [awaiting, setAwaiting] = useState(false);

    // Função para carregar o usuário
    useEffect(() => {
        const userData = async () => {
            try {
                const response = await axiosInstance.get("/api/users/user");
                const { name, email, _id: userId } = response.data.user;
                setUser({ name, email, userId });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    router.push("/Login");
                }
            } finally {
                setLoading(false);
            }
        };
        userData();
    }, []);

    // Função para carregar as tarefas
    const fetchTasks = async () => {
        if (!user || !user.userId) return;
        try {
            const response = await axiosInstance.get("/api/tasks/task", {
                params: { userId: user.userId },
            });

            if (
                Array.isArray(response.data) ||
                (response.data && Array.isArray(response.data.tasks))
            ) {
                const tasksData = Array.isArray(response.data)
                    ? response.data
                    : response.data.tasks;

                const formattedTasks = tasksData.map((task) => ({
                    ...task,
                    date: task.date
                        ? new Date(task.date).toLocaleDateString("pt-BR", {
                                timeZone: "UTC",
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                        })
                        : "",
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

    // Funções para manipulação das tarefas
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
            const response = await axiosInstance.post(
                "/api/tasks/task",
                taskData
            );
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

    // Atualizar o status de uma tarefa
    const handleUpdatedTask = async (taskId) => {
        const taskToUpdate = tasks.find((task) => task._id === taskId);

        if (!taskToUpdate) {
            return;
        }

        try {
            // Atualiza o estado local das tarefas
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId
                        ? { ...task, status: !task.status }
                        : task
                )
            );

            // Envia apenas a atualização do status
            const updatedTask = {
                status: !taskToUpdate.status, // Apenas o status é atualizado
            };

            await axiosInstance.put(`/api/tasks/${taskId}`, updatedTask);
            await fetchTasks(); // Atualiza a lista de tarefas
        } catch (error) {
            console.log(error);
        }
    };

    // Editar uma tarefa
    const handleEdit = (task) => {
        setTaskToEdit(task);
        router.push("/EditTask");
    };

    // Remover uma tarefa
    const handleRemove = (id) => {
        taskIdToRemove.current = id;
        const taskToRemove = tasks.find(
            (task) => task._id === taskIdToRemove.current
        );

        setTaskRemove(taskToRemove);
        setIsDisable(true);
        setConfirm(true);
    };

    const handleConfirm = async () => {
        const { _id: taskId } = taskRemove;
        setAwaiting(true);
        try {
            const response = await axiosInstance.delete(`/api/tasks/${taskId}`);
            console.log(response.data);
            setAwaiting(false);
            setConfirm(false);
            setIsDisable(false);
            await fetchTasks();
        } catch (error) {
            console.log(error);
        }
    };

    const handleCancel = () => {
        setConfirm(false);
        setIsDisable(false);
        setAwaiting(false);
    };

    return (
        <>
            <NavBar showLogout={true} />
            <div className="w-100 mt-5 d-flex flex-column justify-content-center align-items-center">
                <h1>Olá, bem-vindo {user?.name}</h1>

                <div className={styles.form}>
                    <form onSubmit={handleCreate} className="form-floating mb-4">
                        <h2 className="fs-4 mt-4 text-center">
                            Adicione novas tarefas:
                        </h2>
                        <div className="bg-secondary p-3 rounded-3 ">
                            <label className={styles.label} htmlFor="title">
                                Título da tarefa:
                            </label>
                            <input
                                className={styles.input}
                                type="text"
                                name="title"
                                id="title"
                                placeholder="Participar da reunião..."
                                required
                                value={newTask.title}
                                onChange={handleChange}
                                disabled={isDisable}
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
                                disabled={isDisable}
                            />
                            <button
                                className={styles.button}
                                type="submit"
                                disabled={isDisable}
                            >
                                Criar tarefa
                            </button>
                        </div>
                    </form>
                </div>

                {tasks.length > 0 ? (
                    tasks.map((task) =>
                        task && task.title ? (
                            <div
                                key={task._id}
                                className={`${styles.tasksCard} ${
                                    task.status ? styles.completedTask : ""
                                }`}
                                id={task._id}
                            >
                                <div className={styles.text}>
                                    <p>{task.title}</p>
                                    <p>prazo: {task.date}</p>
                                </div>
                                <div className={styles.buttons}>
                                    <button
                                        className={styles.btnPen}
                                        onClick={() =>
                                            handleEdit({
                                                title: task.title,
                                                date: task.date,
                                                id: task._id,
                                            })
                                        }
                                        disabled={isDisable}
                                    >
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button
                                        className={styles.btnXmark}
                                        onClick={() => handleRemove(task._id)}
                                        disabled={isDisable}
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                    <button
                                        className={styles.btnCheck}
                                        onClick={() =>
                                            handleUpdatedTask(task._id)
                                        }
                                        disabled={isDisable}
                                    >
                                        <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                </div>
                            </div>
                        ) : null
                    )
                ) : (
                    <p className="text-body-tertiary">
                        Nenhuma tarefa adicionada ainda
                    </p>
                )}
                {confirm && taskRemove && (
                    <div className={styles.confirmContainer}>
                        <p>Tem certeza que deseja excluir a tarefa:</p>
                        <p>{taskRemove.title}</p>
                        <div className={styles.buttons}>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCancel}
                            >
                                Cancelar
                            </button>
                            <button
                                className={styles.confirmButton}
                                onClick={handleConfirm}
                            >
                                Confirmar
                            </button>
                            {awaiting && (
                                <div className={styles.confirmLoading}>
                                    <p>Excluindo...</p>
                                    <div className="d-flex justify-content-center align-items-center mt-2">
                                        <div
                                            className={styles["loading-spiner"]}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default PaginaInicial
