import React from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            modal1: false,
            editado: {}, 
            cambio:false
        }
    }
    cerrar=()=>{
        localStorage.removeItem("token");
        this.setState({
            cambio:true
        });
    }
    actualizaruser = async () => {
        await axios.put(`${this.props.ruta}putusuario/${this.state.editado._id}`, this.state.editado)
            .then(async (res) => {
                localStorage.setItem('token',res.data.token);
                await axios.get(`${this.props.ruta}getoneuser/${localStorage.getItem('token')}`).then((res) => {
                    this.setState({
                        user: res.data[0]
                    });
                }).catch((err) => { console.log(err) });
            })
            .catch(err => console.log(err));
    };
    handleCloseI = () => {
        this.setState({
            modal1: false
        });
    }
    Subir = () => {
        let inpu = document.getElementById("imagen");
        if (inpu.files && inpu.files[0]) {
            let aux = this.state.editado;
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
                editado: aux
            });
        }
    }
    handleOpenI = () => {
        this.setState({
            modal1: true,
            editado: this.state.user
        });
    }

    handlechangeI = (prop) => {
        let aux = this.state.editado;
        aux[prop] = document.getElementById(prop+"a").value;
        console.log(aux);
        this.setState({
            editado: aux
        });
    }
    componentDidMount = async () => {
        await axios.get(`${this.props.ruta}getoneuser/${localStorage.getItem('token')}`).then((res) => {
            this.setState({
                user: res.data[0]
            });
        }).catch((err) => { console.log(err) });
    }
    render() {
        return <>
            <Container fluid>
                <Row className="justify-content-md-center">
                    <Col>
                        <img src={this.state.user?.Img} width='100%' alt="" />
                    </Col>
                    <Col>
                        <Form autoComplete="off">
                            <h1>Perfil</h1>
                            <Form.Row>
                                <Form.Group as={Col} >
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" id='Nombre' value={this.state.user?.Nombre} autoComplete='off' placeholder="Enter your name" disabled />
                                </Form.Group>
                                <Form.Group as={Col} >
                                    <Form.Label>Apellidos</Form.Label>
                                    <Form.Control type="text" id='Apellidos' value={this.state.user?.Apellidos} autoComplete='off' placeholder="Enter your lastname" disabled />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} >
                                    <Form.Label>Correo</Form.Label>
                                    <Form.Control type="email" id='Correo' value={this.state.user?.Correo} autoComplete='off' placeholder="Enter email" disabled />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} >
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control type="password" id='Password' value={this.state.user?.Password} autoComplete='off' placeholder="Password" disabled />
                                </Form.Group>
                            </Form.Row>
                            {/*<Button variant="primary" type="button" onClick={() => {
                            }}>
                                Editar Contraseña
                        </Button>{" "}*/}
                        
                            <Button variant="primary" type="button" onClick={() => {
                                this.handleOpenI();
                            }}>
                                Editar perfil
                        </Button>{" "}
                            <Button variant="primary" type="button" onClick={() => {
                                this.cerrar();
                            }}>
                                Cerrear sesion
                        </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>

            <Modal show={this.state.modal1} onHide={this.handleCloseI} aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Insertar nueva tarea</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete="off">
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" id='Nombrea' autoComplete='off'  placeholder="Enter name to work" onChange={() => { this.handlechangeI('Nombre') }} />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control type="text" id='Apellidosa' autoComplete='off'  placeholder="Enter name to work" onChange={() => { this.handlechangeI('Apellidos') }} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Correo</Form.Label>
                                <Form.Control type="text" id='Correoa' autoComplete='off' placeholder="Enter name to work" onChange={() => { this.handlechangeI('Correo') }} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Imegen de Perfil</Form.Label>
                                <Form.Control type="file" id="imagen" accept="image/" autoComplete='off' onChange={() => { this.Subir() }} />
                            </Form.Group>
                            <Form.Group as={Col}  >
                                <img src={this.state.editado?.Img ? this.state.editado?.Img : 'https://i.pinimg.com/474x/d2/97/a3/d297a3eced48990f8001c8624ec84145.jpg'} value={this.state.editado?.Img ? this.state.editado?.Img : 'https://i.pinimg.com/474x/d2/97/a3/d297a3eced48990f8001c8624ec84145.jpg'} id="Img" height='100vh' />
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleCloseI}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => {
                        this.actualizaruser();
                        this.handleCloseI();
                    }}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
            {
                this.state.cambio && <Redirect to="/"/>
            }
        </>;
    }
}

export default Main;