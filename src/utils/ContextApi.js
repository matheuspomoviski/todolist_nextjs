import { createContext, useContext, useState } from "react";

const TaskContext = createContext()

export const TaskProvider = ({children}) =>{
  const [taskToEdit, setTaskToEdit] = useState(null)

  return(
    <TaskContext.Provider value={{taskToEdit, setTaskToEdit}}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => useContext(TaskContext)