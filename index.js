const express = require('express')
const mongoose = require('mongoose')
//mongoose.connect('mongodb://localhost/my_database', {useNewUrlParser: true})
mongoose.connect('mongodb+srv://minhblog_1:Anhminh17032000@cluster0.nltck4g.mongodb.net/my_database', {useNewUrlParser: true});

const expressSession = require('express-session')
const flash = require('connect-flash');

const app = new express()
const ejs = require('ejs')
app.set('view engine','ejs')
const { resourceUsage } = require('process')


//register the middleware
app.use(express.static('public'))
app.use(express.json())
//app.use(express.urlencoded())
const fileUpload = require('express-fileupload')
app.use(fileUpload())
app.use(flash())


const validateMiddleWare = require('./middleware/validationMiddleware')
app.use('/posts/store', validateMiddleWare)

let port = process.env.PORT;
if(port==null||port==""){
    port = 4000
}
app.listen(port, ()=>{
    console.log('App listening...')
})

const BlogPost = require('./models/BlogPost')
const path = require('path')

// use express session
app.use(expressSession({
    secret:'keyboard cat'
}))

// contact
app.get('/contact',(req,res)=>{
    res.render('contact');
})


app.get('/about', (req, res)=>{
    res.render('about')
})


// Conditionally Display New Post, Login and New User links
global.loggedIn = null; //declare a global variable loggedIn that will be accessible from all our EJS files

//specify with the wildcard *, that on all requests
app.use('*', (req, res, next) => {
    loggedIn=req.session.userId;
    next()
})



const newPostController = require('./controllers/newPost')
const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const authMiddleware = require('./middleware/authMiddleware')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const logoutController = require('./controllers/logout')

app.get('/posts/new', newPostController);
app.get('/', homeController);
app.get('/post/:id', getPostController);
app.post('/posts/store', storePostController);
app.get('/auth/register', newUserController);
app.post('/users/register', storeUserController);
app.get('/auth/login', loginController);
app.post('/users/login',loginUserController)
app.post('/posts/new', authMiddleware, newPostController)
app.post('/posts/store', authMiddleware, storePostController)

app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)
app.post('/users/login',redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/auth/logout', logoutController)

app.use((req, res) => res.render('notfound'));