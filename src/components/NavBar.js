import {Navbar, Nav, NavbarBrand} from 'react-bootstrap';

const NavBar = () => {
  return (
    <Navbar bg="dark" variant="dark" className='justify-content-center'>
      <Navbar.Brand className='text-center w-100' >
        <h1 className='fs-3'>To Do List</h1>
      </Navbar.Brand>
    </Navbar>
  )
}

export default NavBar