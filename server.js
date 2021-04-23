require('dotenv').config()

const { json } = require('express')
const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')
const { restart } = require('nodemon')

app.use(express.json())
const posts = [
    {
        username: 'ani',
        password: '12345'
    }
    ,
    {
        username: 'sudhee',
        password: '67890'
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    // Authenticate User

    const username = req.body.username
    const user = { name: username }

    const accessToken =  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken})

})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })


}

app.listen(5000)