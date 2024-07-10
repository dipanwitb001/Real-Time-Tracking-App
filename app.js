import express from 'express';
import { Server } from 'socket.io';
import http from 'http'; // Import the HTTP module to create a server
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
In ES modules, __dirname and __filename are not available by default. These variables are commonly used in CommonJS modules to get the directory name and file name of the current module, respectively.

To achieve the same functionality in ES modules, you can use the following workaround involving import.meta.url and the fileURLToPath function from the url module. Here's an explanation of each part:

import.meta.url:

This provides the URL of the current module as a string. For example, if your module is located at file:///D:/backend_js/track/app.js, import.meta.url would contain this URL.
fileURLToPath(import.meta.url):

The fileURLToPath function from the url module converts a file URL to a file path. This means it converts file:///D:/backend_js/track/app.js to D:\backend_js\track\app.js.
const __filename = fileURLToPath(import.meta.url);:

This line assigns the file path of the current module to the __filename variable. So, __filename will be D:\backend_js\track\app.js.
const __dirname = path.dirname(__filename);:

The path.dirname function returns the directory name of a file path. By passing __filename to it, we get the directory name of the current module. So, __dirname will be D:\backend_js\track.

*/ 

const app = express();
const server = http.createServer(app);
const io = new Server(server);





app.set("view engine","ejs");

app.set(express.static(path.join(__dirname, "public")))

app.use(express.static(path.join(__dirname, "public")));

io.on("connection",function(socket){
    socket.on("send-location",function(data){
        io.emit("receive-location",{ id: socket.id, ...data});
    })
    console.log("connected");

    socket.on("disconnect",function() {
        io.emit("user-disconnected",socket.id);
        
    });
    
})





app.get("/", function(req, res) {
    res.render('index');
});

// Create an HTTP server and pass the Express app to it

// Initialize socket.io with the server instance



// Additional socket.io setup can be added here

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
