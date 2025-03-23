// *    S Z E R V E R
const app = require('./methodusok');
const port = 3000;
app.listen(port, () => {
    console.log('A szerver fut: http://localhost:3000');
});