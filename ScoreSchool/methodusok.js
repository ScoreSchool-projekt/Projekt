// *    M O D U L O K 
const express = require('express');
const mysql = require('mysql2');
const bodyparser = require('body-parser')
const cors = require('cors');

const app = express();
app.use(bodyparser.json());
app.use(cors({origin: 'http://localhost:19006'}));

// *    A D A T B A Z I S
const adatb = mysql.createConnection({
    host: '192.168.88.239',
    user: 'root',
    password: '',
    database: 'scoreschool'
});

adatb.connect((err) => {
    if (err) {
        console.log('Nem sikerült csatlakozni az adatbázishoz');
    }
    console.log('Sikeresen csatlakozott az adatbázishoz');
});

// *    M E T H O D U S O K
//  GET - minden adat lekérése
app.get('/:tabla', (req, res) => {
    const { tabla } = req.params;
    const lekerdezes = 'SELECT * FROM ?? ';
    adatb.query(lekerdezes, [tabla], (err, results) => {
        if (err) {
            return  res.json({error: 'Sikertelen lekérdezés: ', err});
        }
        res.json(results);
    });
});

//  GET - egy adat lekérése id alapján
app.get('/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;
    const lekerdezes = 'SELECT * FROM ?? WHERE id = ? ';
    adatb.query(lekerdezes, [tabla, id], (err, results) => {
        if (err) {
            return res.json({error: 'Sikertelen lekérdezés: ', err});
        }
        res.json(results);
    });
});

//  POST - új adat feltöltése 
app.post('/:tabla', (req, res) => {
    const { tabla } = req.params;
    const adatok = req.body;
    const lekerdezes = 'INSERT INTO ?? SET ? ';
    adatb.query(lekerdezes, [tabla, adatok], (err) => {
        if (err) {
           return res.json({error: 'Sikertelen lekérdezés: ', err});
        }
        res.json('Sikeresen feltöltötte az adatokat');
    });
});

//  PUT - adat módosítása id alapján
app.put('/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;
    const adat = req.body;
    const lekerdezes = 'UPDATE ?? SET ? WHERE id = ?';
    adatb.query(lekerdezes, [tabla, adat, id], (err) => {
        if (err) {
            return res.json({error: 'Sikertelen lekérdezés: ', err});
        }
        res.send('Sikeresen módosította az adatot');
    })
});

//  DELETE - adat törlése id alapján
app.delete('/:tabla/:id', (req, res) => {
    const { tabla, id } = req.params;
    const lekerdezes = 'DELETE FROM ?? WHERE id = ?';
    adatb.query(lekerdezes, [tabla, id], (err) => {
        if (err) {
            return res.json({error: 'Sikertelen lekérdezés: ', err});
        }
        res.send('Sikeresen törölte az adatot');
    })
});

// *    S Z E R V E R
const port = 3000;
app.listen(port, () => {
    console.log('A szerver fut: http://localhost:3000');
});