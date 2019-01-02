
// Load the TCP Library
const net = require('net');

var port = 5000;
var clients = [];

// Start a TCP Server
net.createServer( (socket) => {

    socket.setEncoding( 'utf8' );
    socket.setTimeout( 2000 );

    socket.on( 'error', onError.bind({}, socket) );

    let onError = ( socket ) => {
        //    console.log('Socket error!', socket);
        //    console.log('name', socket.name);
    }

    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort

    clients.push( socket );

    // Send a nice welcome message and announce
    socket.write("Welcome " + socket.name + "\n");

    broadcast(socket.name + " joined\n", socket);

    // Handle incoming messages from clients.
    socket.on('data', ( data ) => {

        console.log( JSON.parse(data) );

        broadcast(socket.name + "> " + data, socket);
    });

    // Remove the client from the list when it leaves
    socket.on('end', () => {

        clients.splice(clients.indexOf(socket), 1);

        broadcast(socket.name + " left .\n");
    });




    // Send a message to all clients
    let broadcast = (message, sender) => {
        clients.forEach(function(client) {
            // Don't want to send it to sender
            if (client === sender) return;
            client.write(message);
        });
        // Log it to the server output too
        process.stdout.write(message+"\n\r")
       }

}).listen( port );

// Put a friendly message on the terminal of the server.
console.log("Chat server running at port ", port, "\n");