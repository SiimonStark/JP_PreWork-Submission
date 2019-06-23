const http = require("http");
const url = require("url");
const server = http.createServer();

// ** Global data declaration
let messages = [
  { 'id': 1, 'user': 'brittany storoz', 'message': 'hi there!' },
  { 'id': 2, 'user': 'bob loblaw', 'message': 'check out my law blog' },
  { 'id': 3, 'user': 'lorem ipsum', 'message': 'dolor set amet' }
];

// ** Run server on port xxxx
server.listen(3001, () => {
  // ** Terminal console.log for verification
  console.log('The HTTP server is listening at Port 3001.');
});

server.on('request', (request, response) => {
  if (request.method === 'GET') {
    // ** On GET run helper func()
    getAllMessages(response);
  }
  else if (request.method === 'POST') {
    let newMessage = {'id': new Date() };

    request.on('data', (data) => {
      // ** Collect data from request&parse w/ id
      newMessage = Object.assign(newMessage, JSON.parse(data));
    });

    request.on('end', () => {
      // ** Call helper to add newMessage to ALL messages
      addMessage(newMessage, response)
    });
  }
});

getAllMessages = (response) => {
  response.setHeader('Content-Type', 'application/json')
  response.statusCode = 200
  // ** Send back messages
  response.write(JSON.stringify(messages))
  response.end();
}

addMessage = (newMessage, response) => {
  // ** declare messages toEqual original + newMessage
  messages = [...messages, newMessage];
  response.setHeader('Content-Type', 'application/json')
  response.statusCode = 201
  // ** Send back updated messages
  response.write(JSON.stringify(messages))
  response.end();
}