const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        port: '3306',
        database: 'random_people',
    }
);

db.connect((err) => {
    if (err) {
        console.error('error conntcting db:', err);
        return
    }
    console.log('connect to db')
});
//READ GET
app.get('/', (req, res) => {

    const query = 'SELECT * FROM random_people';
    db.query(query, (err, results) => {
        if (err) {
            console.error('error : ', err);
            res.send('error');
            return;
        }
        res.json(results);
    });
});

//create
app.post('/create', (req, res) => {
    const { f_name, l_name, age, gender } = req.body;
    const query = 'INSERT INTO random_people (first_name, last_name, age, gender) VALUES (?, ?, ?, ?)';
    db.query(query, [f_name, l_name, age, gender], (err, result) => {
        if (err) {
            console.error('Error adding user:', err);
            res.status(500).send('Error adding user');
            return;
        }
        res.status(201).send(`User added with ID: ${result.insertId}`);
    });
});

//update
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { f_name, l_name, age, gender } = req.body;
    const query = 'UPDATE random_people SET first_name = ? , last_name = ?, age = ?, gender = ? WHERE id = ?';
    db.query(query, [f_name, l_name, age, gender ,id], (err, result) => {
        if (err){
            console.error('Error updateing user:', err);
            res.status(500).send('Error updateing user');
            return;
        }
        if (result.affectedRows === 0){
            res.status(404).send('user not found');
            return
        }
        res.send('user updated successfully.')
    });
});

//delete
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    // const { f_name, l_name, age, gender } = req.body;
    const query = 'DELETE from random_people WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err){
            console.error('Error updateing user:', err);
            res.status(500).send('Error updateing user');
            return;
        }
        if (result.affectedRows === 0){
            res.status(404).send('user not found');
            return
        }
        res.send('user updated successfully.')
    });
});

app.listen(3000, () => {
    console.log('server is running in port 3000')
})

