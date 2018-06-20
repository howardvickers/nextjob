var fs = require('fs')
var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var user = {}
const puppeteer = require('puppeteer');

app.use(express.static('./public'))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

var CustardUser = require('./db').CustardUser
var CustardCompany = require('./db').CustardCompany
var CustardOp = require('./db').CustardOp


let doScrape = async function(keyword, city, state) {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    // const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    var url_to_scrape = 'https://www.themuse.com/jobs?keyword%5B%5D=' + keyword + '&job_location%5B%5D=' + city + '%2C%20' + state + '&filter=true'
    await page.goto(url_to_scrape);

    const result = await page.evaluate(() => {
        let data = []; // Create an empty array that will store our data
        let elements = document.querySelectorAll('.job-list-individual'); // Select all Products

        for (var element of elements) { // Loop through each proudct
            let job_title = element.querySelector('h2').innerText; // Select the title
            let employer = element.querySelector('.header-text').innerText; // Select the title
            let location = element.querySelector('.location-value').innerText.trim(); // Select the title
            let thehref = element.querySelector('.job-list-individual__header').href
            let loco = "location.href='"
            let url_begin = loco.concat(thehref)
            let url_end = "'"
            let url = url_begin.concat(url_end)
            let status = 'consider'
            let todo = 'apply'

            data.push({
                job_title,
                employer,
                location,
                url,
                status,
                todo
            }); // Push an object with the data onto our array
        }
        return data; // Return data array
    });
    browser.close();
    return result; // Return data
}

app.get('/', function(req, res) {
    res.sendFile('./index.html', {
        root: './public'
    })
})

app.post('/custard-user', function(req, res, next) {
    console.log('/custard-user req.body: ', req.body)
    var newUser = new CustardUser(req.body)
    console.log('newUser: ', newUser);
    newUser.save(function(err) {
        if (err) {
            next(err)
        } else {
            user = newUser
            console.log('user:', user);
            res.send({
                success: 'Successfully saved a new user!'
            })
        }
    })
})

app.post('/create-op', function(req, res, next) {
    console.log('/create-op req.body:', req.body)
    var newOp = new CustardOp(req.body)
    newOp.save(function(err) {
        if (err) {
            next(err);
            console.log('err:', err);
        } else {
            res.send({
                success: 'Successfully created new op'
            })
        }
    })
})

app.post('/register-user', function(req, res, next) {
    console.log('/register-user req.body.username:', req.body.username)
    var newUser = new CustardUser(req.body)
    newUser.save(function(err) {
        if (err) {
            next(err);
            console.log('err:', err);
        } else {
            res.send({
                success: 'Successfully registered new user'
            })
        }
    })
})

app.post('/signin-user', function(req, res, next) {
    console.log('/signin-user req.body.username:', req.body.username)
    CustardUser.findOne({
        username: req.body.username
    }, function(err, data) {
        if (err) {
            next(err)
        } else if (data) {
            user = data
            console.log('User signed in: ', data)
            res.send({
                success: '200'
            })
        } else {
            res.send({
                failure: 'Failed to login'
            })
        }
    })
})

app.get('/dash', function(req, res) {
    res.send(user)
})

app.get('/dash/ops', function(req, res, next) {
    console.log('/dash/ops req: ', req);
    CustardOp.find({
        _custarduser: user._id
    }, function(err, data) {
        console.log('user._id', user._id);
        if (err) {
            next(err)
        } else {
            res.send(data)
            console.log('/dash/ops data:', data)
        }
    })
});

app.post('/dash/delete_ops', function(req, res, next) {
    console.log('req.body:', req.body);
    var data = req.body
    console.log('data.opEmployer: ', data.opEmployer);
    CustardOp.findOneAndRemove({
        opemployer: data.opEmployer,
        oplocation: data.opLocation,
        opjobtitle: data.opJobtitle
    }, function(err, opschema) {
        if (err) {
            res.json({
                "err": err
            });
        } else {
            res.send('success!')
            console.log(opschema + " removed!");
        }
    });
});

app.post('/update', function(req, res, next) {
    console.log('req.body:', req.body);
    var data = req.body
    console.log('data:', data);
    console.log('data.opjobtitle: ', data.opjobtitle);
    CustardOp.findOneAndUpdate({
        opemployer: data.opemployer,
        oplocation: data.oplocation,
        opjobtitle: data.opjobtitle
    }, {
        $set: {
            opstatus: data.opstatus,
            optodo: data.optodo
        }
    }, function(err, opschema) {
        if (err) {
            res.json({
                "err": err
            });
        } else {
            console.log('data.opstatus:', data.opstatus);
            console.log('data.optodo:', data.optodo);

            res.send('success!')
            console.log(opschema + " updated!");
        }
    });
});

app.post('/scrape', function(req, res, next) {
    console.log('req.body:', req.body);
    var scrapedData = doScrape(req.body.kw, req.body.cty, req.body.ste, ).then((value) => res.send(value));
})

app.get('/me/ops', function(req, res, next) {
    CustardOp.find({
        _custarduser: user._id
    }, function(err, data) {
        if (err) {
            next(err)
        } else {
            res.send(data)
            console.log('/me/ops data:', data)
        }
    })
})

app.listen(80)
