import React from 'react';
import { Card, Accordion, Button, Row, ToggleButtonGroup, Container, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import Iniciar from './../Components/login';
import Registrar from './../Components/registro';
import axios from 'axios';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: localStorage.getItem('token'),
            cambio: false
        }
    }
    componentDidMount = async () => {
        let result = await axios.get(`${this.props.ruta}verificar/${this.state.token}`).then(res => {
            return res.data.validation;
        })
            .catch(err => {
                console.log(err);
            });
        this.setState({
            cambio: result
        });
    }
    render() {
        return <>
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="auto" >
                        <Accordion defaultActiveKey="0">
                            <Card bg='dark' text='white'>
                                <Card.Header>
                                    <ToggleButtonGroup name="options">
                                        <Accordion.Toggle as={Button} variant='dark' eventKey="0">
                                            Iniciar sesion
                                        </Accordion.Toggle >
                                        <Accordion.Toggle as={Button} variant='dark' eventKey="1">
                                            Registrar
                                        </Accordion.Toggle>
                                    </ToggleButtonGroup>
                                </Card.Header>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <Iniciar ruta={this.props.ruta} />
                                    </Card.Body>
                                </Accordion.Collapse>
                                <Accordion.Collapse eventKey="1">
                                    <Card.Body>
                                        <Registrar ruta={this.props.ruta} />
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </Col>
                </Row>
            </Container>
            {this.state.cambio && <Redirect to="/agenda" />}
        </>;
    }
}

export default Login;