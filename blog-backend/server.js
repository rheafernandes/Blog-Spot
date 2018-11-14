const http= require('http');
const app=require('./app');

// This is usually injected from the environment or we can hard code it to so
const port =process.env.PORT ||3000; 


const server= http.createServer(app);
server.listen(port);