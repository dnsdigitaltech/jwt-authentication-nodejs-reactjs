const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());

const users = [
    {
        id: "1",
        username: "davi",
        password: "davi3223",
        isAdmin: true
    },
    {
        id: "2",
        username: "bernardo",
        password: "bernardo3223",
        isAdmin: false
    }   

];

app.post("/api/login", (req, res) => {
    const{username, password} = req.body;
    const user = users.find(u=> {
        return u.username === username, u.password ===password;
    });
    if(user){
        //gerar acesso ao token
        const accessToken = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "mySecretKey");
        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken
        })
    }else{
        res.status(400).json("Usuário ou senha está incorreto!");
    }
});

app.listen(5000, () => console.log("Servidor executando, http://localhost:5000"));