const http = require('http');

const todos = [
    {id:1, text:'hello there'}
]

const server = http.createServer((req, res)=>{

    const {headers, method, url} = req;
    console.log(method, url);

    // res.statusCode = 404
    // res.setHeader('Content-Type', 'application/json');
    // res.setHeader('X-Powered-By','Node.js');
    // res.write('<h1>he</h1>hi');

    res.writeHead(200, { 
        'Content-type': 'application/json',
        'X-Powered-By': 'Node.js'
    });

    let body = []

    req.on('data', chunk =>{
        body.push(chunk); 
    }).on('end', () =>{
        body = Buffer.concat(body).toString();
        console.log(body)
    })

    console.log(req.headers.authorization)
    res.end(
        JSON.stringify({
        success: true,
        data: todos
    }));
});

const methodsServer = http.createServer((req, res)=>{
    const {method, url} = req;
    let body = [];

    req.on('data', chunk =>{
        body.push(chunk);
    }).on('end',() => {
        body = Buffer.concat(body).toString();

        let status = 404;
        const response = {
            success:false,
            data: null
        };
        
        if (method === 'GET' && url === '/todos'){
            status = 200;
            response.success = true;
            response.data = todos;
        }
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'X-Powered-By': 'Node.js'
        });

        res.end(JSON.stringify(response));
        
    });
});

const PORT = 5000;

methodsServer.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})