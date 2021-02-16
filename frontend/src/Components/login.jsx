import axios from 'axios';
import React from 'react';
import { Form, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                Correo: false,
                Password: false
            },
            cambiar: false
        }
    }

    componentDidMount() {
        for (let index in this.state.user) {
            this.handlechange(index);
        }
    }
    handleSubmit = async () => {
        let valid = true;
        for (let index in this.state.user) {
            if (!this.state.user[index]) {
                document.getElementById(index+'l').style.borderColor = 'red';
                valid = false;
            }
            else {
                document.getElementById(index+'l').style.borderColor = 'green'
            }
        }
        this.state.user.Correo ?
            await axios.get(`${this.props.ruta}getoneuser/${this.state.user.Correo}`)
                .then(res => {
                    if (res.data.length == 0) {
                        document.getElementById('Correol').style.borderColor = 'red';                        
                        document.getElementById('Correol').placeholder = 'Este correo no esta registrado';
                        document.getElementById('Correol').value = '';
                        valid = false;
                    }
                }
                ).catch(err => { console.log(err) }) :
            document.getElementById('Correol').style.borderColor = 'green';
        if (valid) {
            await axios.post(`${this.props.ruta}login`, this.state.user)
                .then(res => {
                    if (res.data.valid) {
                        this.setState({
                            cambiar: true
                        });
                        localStorage.setItem('token', res.data.token);
                    }else{                        
                        document.getElementById('Passwordl').style.borderColor = 'red';
                        document.getElementById('Passwordl').placeholder = 'Contraseña incorrecta';
                        document.getElementById('Passwordl').value = '';
                    }
                }
                ).catch(err => { console.log(err) });
        }
    };
    handlechange = (prop) => {
        let aux = this.state.user;
        aux[prop] = document.getElementById(prop+'l').value;
        this.setState({
            user: aux
        });
    }
    render() {
        return <>
            <Form>
                <h1>Iniciar Sesion</h1>
                <Form.Group>
                    <Form.Label>Correo</Form.Label>
                    <Form.Control type="email" id="Correol" placeholder="Enter email" onChange={() => { this.handlechange('Correo') }} />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control type="password" id="Passwordl" placeholder="Password" onChange={() => { this.handlechange('Password') }} />
                </Form.Group>
                <Button variant="primary" type="button" onClick={() => {
                    this.handleSubmit();
                }}>
                    Iniciar sesion
                 </Button>
            </Form>
            {
                this.state.cambiar && <Redirect to='/agenda' />
            }
        </>;
    }
}

export default Login;