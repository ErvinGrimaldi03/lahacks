if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const home = require('./routes/home');
const auth = require('./routes/auth');
const dashboard = require('./routes/dashboard');
const Admin = require('./models/admin');
const Student = require('./models/student');
const Professor = require('./models/professor');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportLocalMongoose = require('passport-local-mongoose');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const app = express();
// const socketIo = require('socket.io');
// const io = socketIo(server);


// io.on('connection', (socket) => {
//     // Check if the connection is from the specific page
//     const url = socket.handshake.headers.referer;
//     const idMatch = url.match(/lectures\/([^\/]+)\/watch/);
//     if (idMatch && idMatch[1]) {
//         console.log('A user connected to the specific page', idMatch[1]);

//         // Here you can add logic specific to this page
//         // For example, emit messages, listen for events, etc.

//         socket.on('disconnect', () => {
//             console.log('User disconnected');
//         });
//     }
// });

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.set('trust proxy', true);

app.use(morgan('combined'));

mongoose.connect(process.env.DB_URL || 'mongodb://127.0.0.1:27017/lahacks')
    .then(() => console.log('Connected to DB!'))
    .catch((error) => console.log(error.message));

app.use(session({
    name: 'lahacks-session',
    secret: process.env.SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        name: 'lahacks-auth',
        maxAge: 24000 * 60 * 60 * 14, // 14 days
        secure: 'auto'
    },
    store: MongoStore.create({
        mongoUrl: process.env.DB_URL || 'mongodb://127.0.0.1:27017/lahacks'
    })
})
);


app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.companyName = 'LA Hacks';
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    res.locals.success = req.flash('success');
    res.locals.protocol = req.protocol;
    res.locals.production = process.env.NODE_ENV == 'production';
    res.locals.hostURL = req.get('host');
    next();
});

app.use(home); // use home routes
app.use(auth);
app.use(dashboard);

// User Auth Code

passport.serializeUser(function (user, done) {
    user.accountType = user.constructor.modelName; // Admin, Professor, or Student
    done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
    try {
        let user = await Admin.findOne({ _id: id });
        if (!user) user = await Professor.findOne({ _id: id });
        if (!user) user = await Student.findOne({ _id: id });
        user.accountType = user.constructor.modelName; // Admin, Professor, or Student
        done(null, user);
    } catch (err) {
        done(err);
    }
});


passport.use('admin', new LocalStrategy(Admin.authenticate()));
passport.use('professor', new LocalStrategy(Professor.authenticate()));
passport.use('student', new LocalStrategy(Student.authenticate()));


let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(process.env.NODE_ENV);
    console.log("Server is listening on port", port);
});