import styles from "../styles/FormContainer.module.css";

const FormContainer = ({
    inputs = [],
    titulo,
    buttonText,
    buttonLink,
    paragraphText,
    onSubmit,
    onButtonClick,
    formData,
    handleInputChange,
    error,
}) => {
    return (
        <div className={styles.container}>
            <h1>{titulo}</h1>
            <div className="d-flex justify-content-center align-items-center vh-50">
                <form className={styles.formContainer} onSubmit={onSubmit}>
                    {inputs.map((input, index) => (
                        <div key={index} className="form-floating mb-4 w-100">
                            <input
                                type={input.type}
                                className="form-control"
                                placeholder={input.placeholder}
                                id={input.id}
                                name={input.id} // Atribuindo o nome do campo
                                value={formData[input.id]} // Ligando o valor ao estado do formData
                                onChange={handleInputChange} // Atualizando o estado quando o valor mudar
                                required
                            />
                            <label htmlFor={input.id}>{input.label}</label>
                        </div>
                    ))}
                    {error && <div className="text-danger bg-white p-1 mb-3 rounded">
                        <small>{error}</small></div>}
                    
                        <button type="submit" className="btn btn-success">
                            {buttonText}
                        </button>
                    
                </form>
            </div>
            <p className="fst-italic mt-2">{paragraphText}</p>
            <button className="btn btn-light" onClick={onButtonClick}>
                {buttonLink}
            </button>
        </div>
    );
};

export default FormContainer;
