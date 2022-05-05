const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken')

const JWTSecret ="ashahsabsuh"

app.use(cors());

app.use(express.urlencoded({extended: true}));
app.use(express.json());

var db = {
    games:[

        {
            id: 01,
            title: "World of Warcraft",
            year: 2004,
            price: 60
        },
        {
            id: 02,
            title: "Minecraft",
            year: 2011,
            price: 60
        },
        {
            id: 03,
            title: "Age of Empires IV",
            year: 2022,
            price: 120
        },
        {
            id: 04,
            title: "Dragon Age Inquisition",
            year: 2004,
            price: 2014
        }
    ],
    users: [
        {
            id: 1,
            name: "Issacar Brunow",
            email: "issacarbrunow@gmail.com",
            password: "abcq!2799"
        },
        {
            id: 1,
            name: "Augusto",
            email: "augustobrunow@gmail.com",
            password: "abcq!2799"
        },
    ]
}

app.get("/games",auth, (req, res ) => {
    res.statusCode = 200;
    res.json(db.games);
})

app.get("/game/:id",(req,res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);

        var game = db.games.find(g => g.id == id);

        if(game != undefined){
            res.statusCode= 200;
            res.json(game);
        } else {
            res.sendStatus(404);
        }
    }
    
});

app.post("/game",(req,res) => {
    var {id,title,price,year} = req.body;
    db.games.push({
        id,
        title,
        price,
        year 
    })
    res.sendStatus(200);
})

app.delete("/game/:id",(req,res) => {
    if(isNaN(req.params.id)){
        res.sendStatus(400)
    } else {
        var id = parseInt(req.params.id);
        var index= db.games.find(g => g.id == id);

        if(index == -1){
            res.sendStatus(404)
        } else {
            db.games.splice(index,1);
            res.sendStatus(200);
        }
    };
});

app.put("/game/:id",(req,res) => {

    if(isNaN(req.params.id)){
        res.sendStatus(400);
    } else {
        var id = parseInt(req.params.id);

        var game = db.games.find(g => g.id == id);

        if(game != undefined){
            var {title,price,year} = req.body;

            if(title != undefined){
                game.title = title;
            }
            if(price!= undefined){
                game.price = price;
            }
            if(year != undefined){
                game.year = year;
            }
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    }
    
});

app.post("/auth",(req,res) => {
    var {email, password} = req.body;    

    if(email != undefined) {
        var user = db.users.find(u => u.email == email);
        
        if(user.password == password){
            jwt.sign({id: user.id, email: user.id}, JWTSecret,{expiresIn: '48h'},(err,token) => {
                if(err){
                    res.status(400);
                    res.json({err:"Falha interna"});
                } else {
                    res.status( 200 );
                    res.json({token: token});
                }
            });
        } else {
            res.status(401);
            res.json({err: "Credenciais inválidas"})
        }

    } else {
        res.status(404);
        res.json({err: "O email enviado é inválido"})
    }
});

function auth(req,res,next){

    const authToken = req.headers['authorization'];

    if(authToken != undefined){
        const bearer = authToken.split(' ');
        var token = bearer[1];
        
        jwt.verify(token,JWTSecret,(err,data) => {
            if(err){
                res.status(401);
                res.json({err:"Token Inválido"})
            } else {
                console.log(data)
            }
        })
        
    } else {
        res.status(401);
        res.json({err: "Token inválido"});
    }
    next();
}

app.listen(8000,() =>{
    console.log('API ATIVO');
})