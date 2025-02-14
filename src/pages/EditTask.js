import NavBar from "../components/NavBar";

import { useState } from "react";
import { useRouter } from "next/router";
import { useTask } from "../utils/ContextApi";


import styles from "../styles/PaginaInicial.module.css";
import formatDate from "../utils/formatData";

const EditTask = () => {
    const router = useRouter();
    const { taskToEdit } = useTask();
    const [loginDate] = useState(formatDate());

    if (!taskToEdit) {
        router.push("/PaginaInicial");
    }

    const changePage = () => {
        router.push("PaginaInicial");
    };

    return (
        <>
            <NavBar />
            <div className="w-100 mt-5 d-flex flex-column justify-content-center align-items-center">
                <h1>Edite a sua tarefa:</h1>

                <form className="form-floating mb-4">
                    <div className="bg-secondary p-3 rounded-3">
                        <label className={styles.label} htmlFor="title">Novo título da tarefa:</label>
                        <input className={styles.input} type="text" name="title" id="title" 
                        placeholder={taskToEdit.title}/>
                        <label className={styles.label} htmlFor="date">Novo prazo para conclusão:</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            min={loginDate}
                            //pensar na lógica para definir a data
                            className={styles.date}
                        />
                        <button className={styles.button} type="submit">Atualizar tarefa</button>
                    </div>
                </form>
                <div className={styles.tasksCard}>
                    <div className={styles.text}>
                        <p>{taskToEdit.title}</p>
                        <p>Prazo: {taskToEdit.date}</p>
                    </div>
                </div>
                <button className={styles.cancel} onClick={changePage}>Cancelar</button>
            </div>
        </>
    );
};

export default EditTask;
