const express = require("express");
const app = express();
const cors = require('cors');
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors());
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

let refreshTokens = [];

app.post("/api/refresh", (req, res) => {
    //O usuário faz refresh do token
    const refreshToken = req.body.token;

    //envia error se o token for inválido
    if(!refreshToken) return res.status(401).json("Você não está autenticado!");
    if(!refreshTokens.includes(refreshToken)) {
        return res.status(403).json("Refresh token não é válido");
    }
    jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        refreshTokens.push(newRefreshToken);

        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        })
    })
    //se estiver tudo ok, cria um novo token de acesso, dar um refresh e envia pra o usuário
})

const generateAccessToken = (user) =>{
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 
    "mySecretKey",
    {expiresIn: "15m"})
}

const generateRefreshToken = (user) =>{
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, 
    "myRefreshSecretKey")
}

app.post("/api/login", (req, res) => {
    const{username, password} = req.body;
    const user = users.find(u=> {
        return u.username === username, u.password ===password;
    });
    if(user){
        //gerar acesso ao token
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        refreshTokens.push(refreshToken);
        res.json({
            username: user.username,
            isAdmin: user.isAdmin,
            accessToken,
            refreshToken
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
                return res.status(403).json("Token não é válido!");
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

app.post("/api/logout", verify, (req, res) => {
    const refreshToken = req.body.token;
    refreshTokens = refreshTokens.filter(token => token !== refreshToken);
    res.status(200).json("Você foi deslogado com sucesso!");
})

app.listen(5000, () => console.log("Servidor executando, http://localhost:5000"));