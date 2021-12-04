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

//criando autorização
const verify = (req ,res, next) => {
    const authHeader = req.headers.authorization;
    if(authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, "mySecretKey", (err, user) => {
            if(err) {
                return res.status(403).json("Token não está válido!");
            }
            req.user = user;
            next();
        });
        
    } else {
        res.status(401).json("Você não está autorizado!");
    }
}

app.delete("/api/users/:userId", verify, (req, res) => {
    if(req.user.id === req.params.userId || req.user.isAdmin){
        res.status(200).json("Usuário foi deletado com sucesso!");
    } else {
        res.status(403).json("Você não tem permissão para deletar este usuário");
    } 
})

app.listen(5000, () => console.log("Servidor executando, http://localhost:5000"));