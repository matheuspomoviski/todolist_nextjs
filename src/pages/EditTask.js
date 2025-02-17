import NavBar from "../components/NavBar";
import axiosInstance from "../utils/axiosConfig";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTask } from "../utils/ContextApi";

import styles from "../styles/PaginaInicial.module.css";
import formatDate from "../utils/formatData";

const EditTask = () => {
    const router = useRouter();
    //States
    const [newTask, setNewTask] = useState({});

    const { taskToEdit } = useTask();
    const [loginDate] = useState(formatDate());

    const handleChange = (e) => {
        const {name, value} = e.target
        setNewTask({...newTask, [name]: value})
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const taskId = taskToEdit.id
        const taskUpdated = {...newTask, taskId}

        try {
        const response =  await axiosInstance.put(`/api/tasks/${taskId}`, taskUpdated)
            setTimeout(() => {
                router.push("/PaginaInicial")
            }, 2000);
        } catch (error) {
            console.log(error)
        }
    }
    
    const changePage = () => {
        router.push("PaginaInicial");
    };
    
    //redirecionamento se houver algum erro com o contexto
    useEffect(() => {
        
    if (!taskToEdit) {
        router.push("/PaginaInicial");
    }

    }, [taskToEdit, router])

    if(!taskToEdit) return null

    return (
        <>
            <NavBar />
            <div className="w-100 mt-5 d-flex flex-column justify-content-center align-items-center">
                <h1>Edite a sua tarefa:</h1>

                <form className="form-floating mb-4" onSubmit={handleSubmit}>
                    <div className="bg-secondary p-3 rounded-3">
                        <label className={styles.label} htmlFor="title">
                            Novo título da tarefa:
                        </label>
                        <input
                            className={styles.input}
                            type="text"
                            name="title"
                            id="title"
                            placeholder={taskToEdit.title}
                            onChange={handleChange}
                        />
                        <label className={styles.label} htmlFor="date">
                            Novo prazo para conclusão:
                        </label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            min={loginDate}
                            //pensar na lógica para definir a data
                            className={styles.date}
                            onChange={handleChange}
                        />
                        <button className={styles.button} type="submit">
                            Atualizar tarefa
                        </button>
                    </div>
                </form>
                <div className={styles.tasksCard}>
                    <div className={styles.text}>
                        <p>{taskToEdit.title}</p>
                        <p>Prazo: {taskToEdit.date}</p>
                    </div>
                </div>
                <button className={styles.cancel} onClick={changePage}>
                    Cancelar
                </button>
            </div>
        </>
    );
};

export default EditTask;
