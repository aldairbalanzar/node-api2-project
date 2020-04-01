const server = require('./server.js');

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`\n*** http://localhost:5000 says, "waddup" ***\n`);
})