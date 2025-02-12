import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import NavBar from "../components/NavBar"

const PaginaInicial = () => {
  return (
    <>
    <NavBar/>
    <h1>Olá, bem-vindo</h1>
    </>
  )
}

export default PaginaInicial