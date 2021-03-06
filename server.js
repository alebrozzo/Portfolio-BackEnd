const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// apps
const crossword = require("./src/crosswords/execution");

app.set("port", process.env.PORT || 5000);

// allow for cross domain requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(`${__dirname}/dist`));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// views is directory for all template files
// app.set('views', `${__dirname}/views`);
// app.set('view engine', 'ejs');
/*
app.get('/dist', (request, response) => response.render(`${__dirname}dist/index`));
app.get('/', (request, response) => response.render(`${__dirname}src/index`));
*/

// ROUTES FOR OUR API
// =============================================================================
// get an instance of the express Router
var router = express.Router();
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log("\nSomething is happening!", new Date().toJSON());
    // console.log('params:', req.params);
    // console.log('body:', req.body);
    // validations, authorization checks, or conditional serving could also go here
    //console.log('grid:', req.params.grid || 'no grid');

    // make sure we go to the next routes and don't stop here
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:5000/api)
router.get("/", function(req, res) {
    res.json({ message: "hooray! welcome to the crossword api!" });
});

// more routes for our API will happen here
// get a random crossword puzzle
router
    .route("/random")
    // define the get verb
    .get(function(req, res) {
        console.log("Random crossword requested");
        crossword
            .getCrossword()
            .then(crossword => {
                if (crossword === null) {
                    res.json({ grid: "No solution found for random" });
                } else {
                    //console.log('cr random', crossword);
                    res.json(JSON.stringify(crossword));
                }
            })
            .catch(error => {
                console.log("error:", error);
                res.send(error);
            });
    });

// get a crossword puzzle for a specific grid structure
router
    .route("/full/:grid")
    // define the get verb
    .get(function(req, res) {
        console.log("Full crossord requested. Structure:", JSON.parse(req.params.grid));
        crossword
            .getCrossword(JSON.parse(req.params.grid))
            .then(crossword => {
                if (crossword === null) {
                    res.json({ grid: "No solution found for " + req.params.grid });
                } else {
                    //console.log('cr full', crossword);
                    res.json(JSON.stringify(crossword));
                }
                //console.log('response', res);
            })
            .catch(error => {
                console.log("error", error);
                res.send(error);
            });
    });

// REGISTER OUR ROUTES -------------------------------
// routes for crowssword will be prefixed with /apicw
app.use("/apicw", router);

app.listen(app.get("port"), () =>
    console.log("Node app is running on port", app.get("port"), "and path is", __dirname)
);
