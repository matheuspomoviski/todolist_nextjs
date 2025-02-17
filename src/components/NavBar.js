import {Navbar, Nav, NavbarBrand} from 'react-bootstrap';
import {useAuth} from "../utils/AuthContext"
import styles from "../styles/NavBar.module.css"

const NavBar = () => {
  const { user, logout} = useAuth();
  return (
    <Navbar bg="dark" variant="dark" className=' d-flex justify-content-center'>
      <Navbar.Brand className='text-center w-100' >
        <h1 className='fs-3'>To Do List</h1>
      </Navbar.Brand>
      {user &&(
        <button className={styles.buttonLogout} onClick={logout} >Logout</button>
      )}
    </Navbar>
  )
}

export default NavBar