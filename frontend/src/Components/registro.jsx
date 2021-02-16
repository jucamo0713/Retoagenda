import React from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                Nombre: false,
                Apellidos: false,
                Correo: false,
                Password: false,
                Password2: false,
                Img: 'https://i.pinimg.com/474x/d2/97/a3/d297a3eced48990f8001c8624ec84145.jpg'
            },
            cambiar: false
        }
    }
    Subir = () => {
        let inpu = document.getElementById("imagen");
        if (inpu.files && inpu.files[0]) {
            let aux = this.state.user;
            var reader = new FileReader();
            reader.onload = function (e) {
                aux.Img = e.target.result;
                document.getElementById('Img').innerHTML = "<canvas id='tempCanvas' style='display:none'></canvas>";
                var canvas = document.getElementById("tempCanvas");
                var ctx = canvas.getContext("2d");
                var img = new Image;
                img.src = this.result;
                img.onload = function () {
                    var iw = img.width;
                    var ih = img.height;
                    canvas.width = iw;
                    canvas.height = ih;
                    ctx.drawImage(img, 0, 0, iw, ih);
                    aux.Img = canvas.toDataURL("image/png");
                    document.getElementById("tempCanvas").remove();
                }
                document.getElementById("Img").src = aux.Img;
            }
            reader.readAsDataURL(inpu.files[0]);
            this.setState({
                user: aux
            });
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
                document.getElementById(index).style.borderColor = 'red';
                valid = false;
            }
            else {
                document.getElementById(index).style.borderColor = 'green'
            }
        }
        if (!/^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(this.state.user.Correo)) {
            document.getElementById('Correo').style.borderColor = 'red';
            document.getElementById('Correo').placeholder = 'Este no es un correo Valido';
            document.getElementById('Correo').value = '';
            valid = false;
        }
        this.state.user.Correo ?
            await axios.get(`${this.props.ruta}getoneuser/${this.state.user.Correo}`)
                .then(res => {
                    console.log(res.data);
                    if (res.data.length > 0) {
                        document.getElementById('Correo').style.borderColor = 'red';
                        document.getElementById('Correo').placeholder = 'Este correo ya esta registrado';
                        document.getElementById('Correo').value = '';
                        valid = false;
                    }
                }
                ).catch(err => { console.log(err) }) : document.getElementById('Correo').style.borderColor = 'green';
        if (this.state.user.Password != this.state.user.Password2 && valid) {
            document.getElementById('Password').style.borderColor = 'red';
            document.getElementById('Password2').style.borderColor = 'red';
            valid = false;
        }
        if (valid) {
            await axios.post(`${this.props.ruta}postuser`, this.state.user)
                .then(res => {
                    localStorage.setItem('token', res.data.token);
                    this.setState({
                        cambiar: true
                    });
                }
                ).catch(err => { console.log(err) });
        }
    };
    handlechange = (prop) => {
        let aux = this.state.user;
        aux[prop] = document.getElementById(prop).value;
        this.setState({
            user: aux
        });
    }
    render() {
        return <>
            <Form autoComplete="off">
                <h1>Registrar</h1>
                <Form.Row>
                    <Form.Group as={Col} >
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control type="text" id='Nombre' autoComplete='off' placeholder="Enter your name" onChange={() => { this.handlechange('Nombre') }} />
                    </Form.Group>
                    <Form.Group as={Col} >
                        <Form.Label>Apellidos</Form.Label>
                        <Form.Control type="text" id='Apellidos' autoComplete='off' placeholder="Enter your lastname" onChange={() => { this.handlechange('Apellidos') }} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} >
                        <Form.Label>Correo</Form.Label>
                        <Form.Control type="email" id='Correo' autoComplete='off' placeholder="Enter email" onChange={() => { this.handlechange('Correo') }} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} >
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" id='Password' autoComplete='off' placeholder="Password" onChange={() => { this.handlechange('Password') }} />
                    </Form.Group>
                    <Form.Group as={Col} >
                        <Form.Label>Verificar Contraseña</Form.Label>
                        <Form.Control type="password" id='Password2' autoComplete='off' placeholder="Password" onChange={() => { this.handlechange('Password2') }} />
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} >
                        <Form.Label>Imegen de Perfil</Form.Label>
                        <Form.Control type="file" id="imagen" accept="image/" autoComplete='off' onChange={() => { this.Subir() }} />
                    </Form.Group>
                    <Form.Group as={Col}  >
                        <img src={this.state.user.Img ? this.state.user.Img : 'https://i.pinimg.com/474x/d2/97/a3/d297a3eced48990f8001c8624ec84145.jpg'} value={this.state.user.Img ? this.state.user.Img : 'https://i.pinimg.com/474x/d2/97/a3/d297a3eced48990f8001c8624ec84145.jpg'} id="Img" height='100vh' />
                    </Form.Group>
                </Form.Row>
            <Button variant="primary" type="button" onClick={() => {
                this.handleSubmit();
            }}>
                Registrar
                 </Button>
        </Form>
        {
            this.state.cambiar && <Redirect to='/agenda' />
        }
        </>;
    }
}

export default Login;