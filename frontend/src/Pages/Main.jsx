import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('token'),
            cambio: false,
            Correo: ''
        }
    }
    componentDidMount = async () => {
        await axios.get(`${this.props.ruta}verificar/${this.state.token}`)
            .then(res => {
                this.setState({
                    cambio: !res.data.validation,
                    Correo: res.data.Correo
                });                
            })
            .catch(err => {
                console.log(err);
            });
    }
    render() {
        return <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>Agenda Geek</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/agenda">Agenda</Nav.Link>
                    <Nav.Link href="/perfil">Perfil</Nav.Link>
                </Nav>
            </Navbar>
            <this.props.componente ruta={this.props.ruta} Correo={this.state.Correo} />
            {this.state.cambio && <Redirect to="/" />}
        </>;
    }
}

export default Main;