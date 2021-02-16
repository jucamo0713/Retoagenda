const { Router } = require('express');
const connect = require('./../db/db');
const router = Router();
const jwt = require('jsonwebtoken');
const smtpTransport = require('nodemailer-smtp-transport');
const nodemailer = require('nodemailer');
const encript = require('bcrypt');
const { ObjectId } = require('mongodb');

require('dotenv').config();

let transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.CORREO,
        pass: process.env.PASS
    }

}));
router.get('/', async (req, res) => {
    const db = await connect();
    await db.collection('usuarios').find().toArray((err, resp) => {
        err ? console.log(err) : res.json(resp);
    });
});
router.get('/verificar/:token', async (req, res) => {
    const { token } = req.params;
    const db = await connect();
    jwt.verify(token, '1234567890', (err, correo) => {
        if (err) {
            res.json({ validation: false });
        } else {
            res.json({ validation: true, Correo: correo.Correo });
        }
    });

});
router.get('/getoneuser/:token', async (req, res) => {
    const { token } = req.params;
    const db = await connect();
    jwt.verify(token, '1234567890', async (err, correo) => {
        if (err) {
            res.json({ validation: false });
        } else {
            await db.collection('usuarios').find({ Correo: correo.Correo }).toArray((err, resp) => {
                err ? console.log(err) : res.json(resp);
            });
        }
    });
});

router.get('/gettareas/:token', async (req, res) => {
    const { token } = req.params;
    const db = await connect();
    jwt.verify(token, '1234567890', async (err, correo) => {
        if (err) {
            res.json({ validation: false });
        } else {

            await db.collection('tareas').find({ Correo: correo.Correo }).toArray((err, resp) => {
                err ? console.log(err) : res.json(resp);
            });
        }
    });
});
router.post('/posttareas/:token', async (req, res) => {
    const { token } = req.params;
    const { Fechaven, Img, Prioridad, Nombre, Descripcion } = req.body;
    const db = await connect();
    jwt.verify(token, '1234567890', async (err, correo) => {
        if (err) {
            res.json({ validation: false });
        } else {
            await db.collection('tareas').insertOne({
                Correo: correo.Correo, Fechaven, Img, Prioridad, Nombre, Descripcion, Cumplida: false
            }).then(() => {
                res.json({ si: 'echo' });
            }
            );
        }
    })
});

router.put('/putusuario/:_id', async (req, res) => {
    const { _id } = req.params;
    const { Correo, Nombre, Apellidos, Img } = req.body;
    const db = await connect();
    await db.collection('usuarios').findOneAndUpdate({ "_id": ObjectId(_id) }, {
        $set: {
            Correo, Nombre, Apellidos, Img
        }
    });
    let tokenData = {
        Correo: Correo.toLowerCase()
    }
    let token = jwt.sign(tokenData, '1234567890', {
        expiresIn: 60 * 60 * 24
    })
    res.json({
        valid: valid,
        token: token
    });
});
router.put('/putcumplida/:_id', async (req, res) => {
    const { _id } = req.params;
    const db = await connect();
    await db.collection('tareas').findOneAndUpdate({ "_id": ObjectId(_id) }, {
        $set: {
            Cumplida: true
        }
    });
    res.json({ _id });
});
router.put('/puttarea/:_id', async (req, res) => {
    const { _id } = req.params;
    const { Fechaven, Img, Prioridad, Nombre, Descripcion, Cumplida } = req.body;
    const db = await connect();
    await db.collection('tareas').findOneAndUpdate({ "_id": ObjectId(_id) }, {
        $set: {
            Fechaven, Img, Prioridad, Nombre, Descripcion, Cumplida
        }
    });
    res.json({ _id });
});
router.delete('/deletetarea/:_id', async (req, res) => {
    const { _id } = req.params;
    const db = await connect();
    await db.collection('tareas').findOneAndDelete({ "_id": ObjectId(_id) });
    res.json(_id);
});
router.post('/postuser', async (req, res) => {
    const { Password, Nombre, Apellidos, Correo, Img } = req.body;
    const mailOptions = {
        from: 'Agenda geek',
        to: Correo,
        subject: 'creacion de usuario',
        text: 'Acaba de registrarse en la plataforma de Agenda geek'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
    const db = await connect();

    encript.hash(Password, Math.floor(Math.round() * 30))
        .then(async (HPassword) => {
            await db.collection('usuarios').insertOne({
                Password: HPassword,
                Nombre,
                Apellidos,
                Correo: Correo.toLowerCase(),
                Img
            });
        });
    let tokenData = {
        Correo: Correo.toLowerCase()
    }
    let token = jwt.sign(tokenData, '1234567890', {
        expiresIn: 60 * 60 * 24
    })
    res.json({ token: token });
});

router.post('/login', async (req, res) => {
    const { Password, Correo } = req.body;
    const mailOptions = {
        from: 'Agenda geek',
        to: Correo,
        subject: 'Inicio de sesion',
        text: 'Acaba de iniciar sesion en la plataforma de Agenda geek'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
    });
    const db = await connect();

    await db.collection('usuarios').find({
        Correo: Correo.toLowerCase()
    }).toArray(async (err, resp) => {
        if (err) { console.log(err) }
        else {
            let valid = await encript.compare(Password, resp[0].Password);
            let tokenData = {
                Correo: Correo.toLowerCase()
            }
            let token = jwt.sign(tokenData, '1234567890', {
                expiresIn: 60 * 60 * 24
            })
            res.json({
                valid: valid,
                token: token
            });
        };
    });

});
module.exports = router;