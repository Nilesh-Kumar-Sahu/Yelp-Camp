var express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  methodOverride = require('method-override'),
  User = require('./models/user'),
  Campground = require('./models/campground'),
  Comment = require('./models/comment'),
  app = express(),
  seedDB = require('./seeds');

// requiring routes
var commentRoutes = require('./routes/comments'),
  campgroundRoutes = require('./routes/campgrounds'),
  indexRoutes = require('./routes/index');

mongoose.connect(
  process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSOWORD),
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

// Parse the json data
app.use(express.json());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());

// PASSPORT CONFIGURATION
//============================
// required for passport session

app.use(
  session({
    secret: 'secrettexthere',
    saveUninitialized: true,
    resave: true,
    // using store session on MongoDB using express-session + connect
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: 'sessions',
    }),
  })
);

// REAL PASSPORT CONFIGURATION
// ================================
// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); //User.authenticate (It is a method  that comes from the passportLocalMongoose package).
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user; //whatever we put in res.locals is available in our tempalates i.e. views directory.
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next(); //if we don't put this next we cannot go to the next middelware that is always may be the route handeler
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT || 3000, function () {
  console.log('The YelpCamp Server Has Started');
});
