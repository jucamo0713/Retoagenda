import React from 'react';
import { Modal, Col, Row, Container, Card, Button, ButtonGroup, Media, Accordion, Form } from 'react-bootstrap';
import axios from 'axios';
class Agenda extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('token'),
            todo: [],
            pendientes: [],
            cumplidas: [],
            vencidas: [],
            posicionP: 0,
            posicionC: 0,
            posicionV: 0,
            despaginar: 0,
            despaginarC: 0,
            despaginarV: 0,
            eliminar: {
                _id: '',
                Nombre: ''
            },
            actualizar: {
                _id: '', Img: 'https://i.pinimg.com/474x/d2/97/a3/d297a3eced48990f8001c8624ec84145.jpg', Correo: this.props.Correo, Fechaven: new Date(), Prioridad: '', Nombre: '', Descripcion: ''
            },
            modal1: false,
            modal2: false,
            modal3: false,
            tareainsert: { Img: 'https://i.pinimg.com/474x/d2/97/a3/d297a3eced48990f8001c8624ec84145.jpg', Correo: this.props.Correo, Fechaven: new Date(), Prioridad: '', Nombre: '', Descripcion: '' }
        };
    }

    handleCloseI = () => this.setState({
        modal1: false
    });
    handleShowI = () => this.setState({
        modal1: true
    });
    handleCloseD = () => this.setState({
        modal2: false
    });
    handleShowD = (Nombre, _id) => this.setState({
        eliminar: {
            _id: _id,
            Nombre: Nombre
        },
        modal2: true
    });
    handleCloseU = () => this.setState({
        modal3: false
    });
    handleShowU = (objeto) => this.setState({
        actualizar: {...objeto},
        modal3: true
    });
    insertartarea = async () => {
        await axios.post(`${this.props.ruta}posttareas/${this.state.token}`, this.state.tareainsert).then(() => { this.todo(); });
    }
    eliminartarea = async () => {
        await axios.delete(`${this.props.ruta}deletetarea/${this.state.eliminar._id}`).then(() => {
            this.todo();
            this.handleCloseD();
        });
    }
    actualizartarea = async () => {
        await axios.put(`${this.props.ruta}puttarea/${this.state.actualizar._id}`, this.state.actualizar).then(() => {
            console.log('PASAAAAA');
            this.todo();
        });
    }
    
    Completar = async (_id) => {
        await axios.put(`${this.props.ruta}putcumplida/${_id}`).then(() => {
            this.todo();
        });
    }
    componentDidMount() {
        this.todo();
    }
    todo = async () => {
        await axios.get(`${this.props.ruta}gettareas/${this.state.token}`)
            .then(res => {
                console.log(res);
                this.setState(
                    {
                        todo: res.data
                    });
            })
            .catch(err => {
                console.log(err);
            });
        await this.filtrarP();
        await this.filtrarC();
        await this.filtrarV();
    }

    Subir = () => {
        let inpu = document.getElementById("imagen");
        if (inpu.files && inpu.files[0]) {
            let aux = this.state.tareainsert;
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
                tareainsert: aux
            });
        }
    }
    
    SubirU = () => {
        let inpu = document.getElementById("imagenU");
        if (inpu.files && inpu.files[0]) {
            let aux = this.state.actualizar;
            var reader = new FileReader();
            reader.onload = function (e) {
                aux.Img = e.target.result;
                document.getElementById('ImgU').innerHTML = "<canvas id='tempCanvas' style='display:none'></canvas>";
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
                document.getElementById("ImgU").src = aux.Img;
            }
            reader.readAsDataURL(inpu.files[0]);
            this.setState({
                actualizar: aux
            });
        }
    }
    /*Determina renderizado de la flecha a la izquierda*/
    flech = () => {
        if (this.state.despaginar == 0) {
            this.state.despaginar = 1;
        }
        if (this.state.despaginar == this.state.pendientes.length - 1) {
            this.state.despaginar = this.state.pendientes.length - 2;
        }
        if (this.state.despaginar != 1 && this.state.pendientes.length > 3) {
            return (
                <input className="botonescamb" type="button" value="◄" onClick={() => {
                    this.setState({
                        despaginar: this.state.despaginar - 1
                    });
                }} />
            );
        }
    }
    /*Determina renderizado de la flecha a la derecha*/
    flech2 = () => {
        if (this.state.despaginar != this.state.pendientes.length - 2 && this.state.pendientes.length > 3) {
            return (
                <input className="botonescamb" type="button" value="►" onClick={() => {
                    this.setState({
                        despaginar: this.state.despaginar + 1
                    });
                }} />
            );
        }
    }
    flechC = () => {
        if (this.state.despaginarC == 0) {
            this.state.despaginarC = 1;
        }
        if (this.state.despaginarC == this.state.cumplidas.length - 1) {
            this.state.despaginarC = this.state.cumplidas.length - 2;
        }
        if (this.state.despaginarC != 1 && this.state.cumplidas.length > 3) {
            return (
                <input className="botonescamb" type="button" value="◄" onClick={() => {
                    this.setState({
                        despaginarC: this.state.despaginarC - 1
                    });
                }} />
            );
        }
    }
    /*Determina renderizado de la flecha a la derecha*/
    flech2C = () => {

        if (this.state.despaginarC != this.state.cumplidas.length - 2 && this.state.cumplidas.length > 3) {
            return (
                <input className="botonescamb" type="button" value="►" onClick={() => {
                    this.setState({
                        despaginarC: this.state.despaginarC + 1
                    });
                }} />
            );
        }

    }
    flechV = () => {
        if (this.state.despaginarV == 0) {
            this.state.despaginarV = 1;
        }
        if (this.state.despaginarV == this.state.vencidas.length - 1) {
            this.state.despaginarV = this.state.vencidas.length - 2;
        }
        if (this.state.despaginarV != 1 && this.state.vencidas.length > 3) {
            return (
                <input className="botonescamb" type="button" value="◄" onClick={() => {
                    this.setState({
                        despaginarC: this.state.despaginarV - 1
                    });
                }} />
            );
        }
    }
    /*Determina renderizado de la flecha a la derecha*/
    flech2V = () => {

        if (this.state.despaginarV != this.state.vencidas.length - 2 && this.state.vencidas.length > 3) {
            return (
                <input className="botonescamb" type="button" value="►" onClick={() => {
                    this.setState({
                        despaginarC: this.state.despaginarV + 1
                    });
                }} />
            );
        }

    }
    handlechangeI = (prop) => {
        let aux = this.state.tareainsert;
        if (prop == 'Fechaven') {
            aux[prop] = new Date(document.getElementById(prop).value + ' ' + document.getElementById(prop + 'hora').value);
        } else {
            aux[prop] = document.getElementById(prop).value;
        }
        console.log(aux);
        this.setState({
            tareainsert: aux
        });
        console.log(this.state.tareainsert);
    }
    handlechangeU = (prop) => {
        let aux = this.state.actualizar;
        if (prop == 'Fechaven') {
            aux[prop] = new Date(document.getElementById(prop+ 'U').value + ' ' + document.getElementById(prop + 'horaU').value);
        } else {
            aux[prop] = document.getElementById(prop+ 'U').value;
        }
        this.setState({
            actualizar: aux
        });
        console.log(this.state.actualizar);
    }
    filtrarP = async () => {
        let maxp = 4;
        let filtro = document.getElementById('busquedaP')?.value;
        let pendiente = this.state.todo.filter((valor, index) => {
            return (valor.Cumplida == false && new Date(valor.Fechaven) > (new Date()));
        });
        pendiente.sort((a, b) => {
            if (new Date(a.FechaVen) > new Date(b.FechaVen)) {
                return 1;
            } else if (new Date(a.FechaVen) < new Date(b.FechaVen)) {
                return -1;
            } else {
                return 0;
            }
        });
        let ordenado = pendiente.filter((Esito) => Esito.Nombre.toLowerCase().normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2").normalize().includes(filtro.toLowerCase().normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2").normalize()));
        let filtrado = [];
        for (let i = 0; i < (ordenado.length / maxp); i++) {
            let aux = [];
            for (let j = (i * maxp); j < (maxp * (i + 1)) && j < ordenado.length; j++) {
                aux.push(ordenado[j]);
            }
            filtrado.push(aux);
        }
        console.log(this.state.pendientes);
        if (filtrado.length <= this.state.posicionP) {
            this.setState({
                pendientes: filtrado,
                posicionP: 0,
                despaginar: 0
            });
        } else {
            this.setState({
                pendientes: filtrado
            });
        }
    }
    filtrarC = () => {
        let maxp = 4;
        let filtro = document.getElementById('busquedaC')?.value;
        let Cumplidas = this.state.todo.filter((valor, index) => {
            return (valor.Cumplida == true);
        });
        Cumplidas.sort((a, b) => {
            if (new Date(a.FechaVen) > new Date(b.FechaVen)) {
                return 1;
            } else if (new Date(a.FechaVen) < new Date(b.FechaVen)) {
                return -1;
            } else {
                return 0;
            }
        });
        let ordenado = Cumplidas.filter((Esito) => Esito.Nombre.toLowerCase().normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2").normalize().includes(filtro.toLowerCase().normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2").normalize()));
        let filtrado = [];
        for (let i = 0; i < (ordenado.length / maxp); i++) {
            let aux = [];
            for (let j = (i * maxp); j < (maxp * (i + 1)) && j < ordenado.length; j++) {
                aux.push(ordenado[j]);
            }
            filtrado.push(aux);
        }
        if (filtrado.length <= this.state.posicionP) {
            this.setState({
                cumplidas: filtrado,
                posicionC: 0,
                despaginarV: 0
            });
        } else {
            this.setState({
                cumplidas: filtrado
            });
        }
    }

    filtrarV = () => {
        let maxp = 4;
        let filtro = document.getElementById('busquedaV')?.value;
        let Vencidas = this.state.todo.filter((valor, index) => {
            return (valor.Cumplida == false && new Date(valor.Fechaven) < (new Date()));
        });
        Vencidas.sort((a, b) => {
            if (new Date(a.FechaVen) > new Date(b.FechaVen)) {
                return 1;
            } else if (new Date(a.FechaVen) < new Date(b.FechaVen)) {
                return -1;
            } else {
                return 0;
            }
        });
        let ordenado = Vencidas.filter((Esito) => Esito.Nombre.toLowerCase().normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2").normalize().includes(filtro.toLowerCase().normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, "$1$2").normalize()));
        let filtrado = [];
        for (let i = 0; i < (ordenado.length / maxp); i++) {
            let aux = [];
            for (let j = (i * maxp); j < (maxp * (i + 1)) && j < ordenado.length; j++) {
                aux.push(ordenado[j]);
            }
            filtrado.push(aux);
        }
        if (filtrado.length > this.state.posicionP) {
            this.setState({
                vencidas: filtrado,
                posicionV: 0,
                despaginarV: 0
            });
        } else {
            this.setState({
                vencidas: filtrado
            });
        }
    }
    cardtarea = (Nombre, Fecha, Img, Descripcion, Prioridad, _id, objeto) => {
        return <>
            <Row>
                <Col>
                    <Card bg='dark' text='white'>
                        <Accordion>
                            <Accordion.Toggle as={Card.Header} style={{ cursor: 'pointer' }} variant='dark' eventKey="0">
                                <Row>
                                    <Col>
                                        <h3>
                                            {Nombre}
                                        </h3>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <h4>
                                                {Fecha}
                                            </h4>
                                            {' '}
                                            <h5>
                                                ▼
                                            </h5>
                                        </Row>
                                    </Col>
                                </Row>
                            </Accordion.Toggle >
                            <Accordion.Collapse eventKey="0">
                                <Card.Body>
                                    <Media>
                                        <img
                                            width='30%'
                                            height='auto'
                                            className="align-self-center mr-3"
                                            src={Img}
                                        />
                                        <Media.Body>
                                            <h5>{Prioridad}</h5>
                                            <p>
                                                {Descripcion}
                                            </p>
                                            <ButtonGroup>
                                                {!objeto.Cumplida?<>
                                                <Button onClick={()=>{this.Completar(_id)}}>
                                                    Completar
                                                </Button>
                                                </>:''
                                                }
                                                <Button onClick={() => { this.handleShowU(objeto) }}>
                                                    Editar
                                                </Button>
                                                <Button onClick={() => { this.handleShowD(Nombre, _id) }}>
                                                    Eliminar
                                                </Button>
                                            </ButtonGroup>
                                        </Media.Body>
                                    </Media>
                                </Card.Body>
                            </Accordion.Collapse>
                        </Accordion>
                    </Card>
                </Col>
            </Row>

        </>;
    }
    render() {
        return <>
            <Accordion defaultActiveKey='10'>
                <Row style={{width:'100%'}}>
                    <Col>{}
                        <Accordion.Toggle as={Button} variant='dark' eventKey="10">
                            Pendientes
                        </Accordion.Toggle ></Col>
                    <Col>
                        <Accordion.Toggle as={Button} variant='dark' eventKey="11">
                            Cumplidas
                        </Accordion.Toggle ></Col>
                    <Col>
                        <Accordion.Toggle as={Button} variant='dark' eventKey="12">
                            Vencidas
                        </Accordion.Toggle >
                    </Col>
                    <Col><Button variant='dark' onClick={this.handleShowI}>+</Button></Col>
                </Row>
                <Accordion.Collapse eventKey="10">
                    <Container fluid>
                        <br />
                        <Row>
                            <Col><h2>Pendientes</h2></Col>
                            <Col><input type="text" placeholder='Buscar' id="busquedaP" onChange={() => {
                                this.filtrarP();
                            }} /></Col>
                            <Col></Col>
                        </Row>
                        {this.state.pendientes[this.state.posicionP]?.map((objeto) => {
                            return <>
                                {this.cardtarea(objeto.Nombre, objeto.Fechaven, objeto.Img, objeto.Descripcion, objeto.Prioridad, objeto._id, objeto)}
                            </>
                        })}
                        <Row className="justify-content-md-center">

                            {this.flech()}
                            {this.state.pendientes.map((Esito, index) => {
                                try {
                                    const f = index;
                                    if (f != this.state.posicionP && (this.state.despaginar == f || this.state.despaginar == f - 1 || this.state.despaginar == f + 1)) {
                                        return (<><Button key={index} variant='dark' onClick={() => {
                                            this.setState({
                                                posicionP: f,
                                                despaginar: f
                                            });
                                        }}>{f + 1}</Button></>);

                                    } else if (this.state.despaginar == f || this.state.despaginar == f - 1 || this.state.despaginar == f + 1) {
                                        return (<><Button key={index} variant='primary'>{f + 1}</Button></>);
                                    }
                                } catch (err) { }
                            })}
                            {this.flech2()}
                        </Row>
                    </Container>
                </Accordion.Collapse>
                <Accordion.Collapse eventKey="11">
                    <Container fluid>
                        <br />
                        <Row>
                            <Col><h2>Cumplidas</h2></Col>
                            <Col><input type="text" placeholder='Buscar' id="busquedaC" onChange={() => {
                                this.filtrarC();
                            }} /></Col>
                            <Col></Col>
                        </Row>
                        {this.state.cumplidas[this.state.posicionC]?.map((objeto) => {
                            return <>
                                {this.cardtarea(objeto.Nombre, objeto.Fechaven, objeto.Img, objeto.Descripcion, objeto.Prioridad, objeto._id, objeto)}
                            </>
                        })}
                        <Row className="justify-content-md-center">
                            {this.flechC()}
                            {this.state.cumplidas.map((Esito, index) => {
                                try {
                                    const f = index;
                                    if (f != this.state.posicionC && (this.state.despaginarC == f || this.state.despaginarC == f - 1 || this.state.despaginarC == f + 1)) {
                                        return (<><Button key={index} variant='dark' onClick={() => {
                                            this.setState({
                                                posicionC: f,
                                                despaginarC: f
                                            });
                                        }}>{f + 1}</Button></>);

                                    } else if (this.state.despaginarC == f || this.state.despaginarC == f - 1 || this.state.despaginarC == f + 1) {
                                        return (<><Button key={index} variant='primary'>{f + 1}</Button></>);
                                    }
                                } catch (err) { }
                            })}
                            {this.flech2C()}
                        </Row>
                    </Container>
                </Accordion.Collapse>
                <Accordion.Collapse eventKey="12">
                    <Container fluid>
                        <br />
                        <Row>
                            <Col><h2>Vencidas</h2></Col>
                            <Col><input type="text" placeholder='Buscar' id="busquedaV" onChange={() => {
                                this.filtrarV();
                            }} /></Col>
                            <Col></Col>
                        </Row>
                        {this.state.vencidas[this.state.posicionV]?.map((objeto) => {
                            return <>
                                {this.cardtarea(objeto.Nombre, objeto.Fechaven, objeto.Img, objeto.Descripcion, objeto.Prioridad, objeto._id, objeto)}
                            </>
                        })}
                        <Row className="justify-content-md-center">
                            {this.flechV()}
                            {this.state.vencidas.map((Esito, index) => {
                                try {
                                    const f = index;
                                    if (f != this.state.posicionV && (this.state.despaginarV == f || this.state.despaginarV == f - 1 || this.state.despaginarV == f + 1)) {
                                        return (<><Button key={index} variant='dark' onClick={() => {
                                            this.setState({
                                                posicionV: f,
                                                despaginarV: f
                                            });
                                        }}>{f + 1}</Button></>);
                                    } else if (this.state.despaginarV == f || this.state.despaginarV == f - 1 || this.state.despaginarV == f + 1) {
                                        return (<><Button key={index} variant='primary'>{f + 1}</Button></>);
                                    }
                                } catch (err) { }
                            })}
                            {this.flech2V()}
                        </Row>
                    </Container>
                </Accordion.Collapse>
            </Accordion>

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
                                <Form.Control type="text" id='Nombre' autoComplete='off' placeholder="Enter name to work" onChange={() => { this.handlechangeI('Nombre') }} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Fecha de Vencimiento</Form.Label>
                                <Form.Control type="date" id='Fechaven' autoComplete='off' placeholder="Fecha" onChange={() => { this.handlechangeI('Fechaven') }} />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>Hora de Vencimiento</Form.Label>
                                <Form.Control type="time" id='Fechavenhora' autoComplete='off' placeholder="Fecha" onChange={() => { this.handlechangeI('Fechaven') }} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Prioridad</Form.Label>
                                <Form.Control type="text" id='Prioridad' autoComplete='off' placeholder="Enter name to work" onChange={() => { this.handlechangeI('Prioridad') }} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Descripcion</Form.Label>
                                <Form.Control type="text" id='Descripcion' autoComplete='off' placeholder="Enter name to work" onChange={() => { this.handlechangeI('Descripcion') }} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Imegen de Perfil</Form.Label>
                                <Form.Control type="file" id="imagen" accept="image/" autoComplete='off' onChange={() => { this.Subir() }} />
                            </Form.Group>
                            <Form.Group as={Col}  >
                                <img src={this.state.tareainsert.Img ? this.state.tareainsert.Img : 'https://i.pinimg.com/474x/d2/97/a3/d297a3eced48990f8001c8624ec84145.jpg'} value={this.state.tareainsert.Img ? this.state.tareainsert.Img : 'https://i.pinimg.com/474x/d2/97/a3/d297a3eced48990f8001c8624ec84145.jpg'} id="Img" height='100vh' />
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleCloseI}>
                        Close
          </Button>
                    <Button variant="primary" onClick={() => {
                        this.insertartarea();
                        this.handleCloseI();
                    }}>
                        Save Changes
          </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.modal2} onHide={this.handleCloseD} aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar tarea {this.state.eliminar.Nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Esta segur@ que desea eliminar la tarea?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleCloseD}>
                        No
          </Button>
                    <Button variant="primary" onClick={() => {
                        this.eliminartarea();
                    }}>
                        Si
          </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={this.state.modal3} onHide={this.handleCloseU} aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar tarea {this.state.actualizar.Nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form autoComplete="off">
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control type="text" id='NombreU' value={this.state.actualizar.Nombre} autoComplete='off' placeholder="Enter name to work" onChange={() => { this.handlechangeU('Nombre') }} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Fecha de Vencimiento</Form.Label>
                                <Form.Control type="date" id='FechavenU' autoComplete='off' placeholder="Fecha" onChange={() => { this.handlechangeU('Fechaven') }} />
                            </Form.Group>
                            <Form.Group as={Col} >
                                <Form.Label>Hora de Vencimiento</Form.Label>
                                <Form.Control type="time" id='FechavenhoraU' autoComplete='off' placeholder="Fecha" onChange={() => { this.handlechangeU('Fechaven') }} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Prioridad</Form.Label>
                                <Form.Control type="text" id='PrioridadU' value={this.state.actualizar.Prioridad} autoComplete='off' placeholder="Enter name to work" onChange={() => { this.handlechangeU('Prioridad') }} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Descripcion</Form.Label>
                                <Form.Control type="text" id='DescripcionU' value={this.state.actualizar.Descripcion} autoComplete='off' placeholder="Enter name to work" onChange={() => { this.handlechangeU('Descripcion') }} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} >
                                <Form.Label>Imegen de Perfil</Form.Label>
                                <Form.Control type="file" id="imagenU" accept="image/" autoComplete='off' onChange={() => { this.SubirU() }} />
                            </Form.Group>
                            <Form.Group as={Col}  >
                                <img src={this.state.actualizar.Img ? this.state.actualizar.Img : 'https://i.pinimg.com/474x/d2/97/a3/d297a3eced48990f8001c8624ec84145.jpg'} value={this.state.actualizar.Img ? this.state.actualizar.Img : 'https://i.pinimg.com/474x/d2/97/a3/d297a3eced48990f8001c8624ec84145.jpg'} id="ImgU" height='100vh' />
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleCloseU}>
                        Close
          </Button>
                    <Button variant="primary" onClick={() => {
                        this.actualizartarea();
                        this.handleCloseU();
                    }}>
                        Save Changes
          </Button>
                </Modal.Footer>
            </Modal>
        </>;

    }
}

export default Agenda;
