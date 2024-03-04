let express = require('express')

let app = express();


app.use(express.static(__dirname + '/dist/angular-client'))

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/dist/angular-client/index.html')
});

app.listen(process.env.PORT || 8080)