const express = require('express');
const cors = require('cors');

// ** Sets up app as an Express server, so that we can import to server
const app = express();
app.use(express.json());
app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });
 
//  ** Default Data on startup
 app.locals.cardList = [
  { 
    id: 0, 
    title: "Welcome to Sticky Do's", 
    content: [
      {
        id: 1,
        type: 'note',
        text: 'This is a standard note. Which is the default when you start typing in our input box ⤴️',
        checked: null
      }
    ]
  },
  { 
    id: 2, 
    title: "Example #2", 
    content: [
      {
        id: 1,
        type: 'list',
        text: 'This is a list item. If you click the ☑️ button in the input box',
        checked: false
      },
      {
        id: 2,
        type: 'list',
        text: 'You can add as many checkList items as you would like!',
        checked: true
      }
    ]
  }
]

//  //these below are for home path
//  app.get('/', function(req, res, next) {
//   // Handle the get for this route
//  });
 
//  app.post('/', function(req, res, next) {
//  // Handle the post for this route
//  });

 // ** this below is for post of data
 app.post('/api/v1/cardList', (request, response) => {
  const cardList = request.body;
  const {id, title, content} = cardList;

  if (!title || !content) {
    return response.status(422).send({
      error: 'Please be sure to include the title and content'
    });
  } else {
    app.locals.cardList.push({...cardList});
    return response.status(201).json({...cardList});
  }
})

// app.set('port', process.send.PORT || 3000)
app.locals.title = 'Sticky-Dos'
// ** Setting up initial route
app.get('/', (request, response) => response.send('Oh hey there'))

// ** API path to retrieve All of the User Notes
app.get('/api/v1/cardList', (request, response) => {
  // ** Handles whether ther is an error with our list of cards on Load
  const cardList = app.locals.cardList
  if(app.locals.cardList) {
    return response.json({ cardList })
  } else {
    response.status(404).send({
      error: request.body
    })
  }
})

// ** API path for DELETE Request for a Note
// !! For both DELETE & PUT we want to make sure we are changing the card based on the path id. Which will make the request more specific
app.delete('/api/v1/cardList/:id', (request, response) => {
  // ** We first find the index, then if present, remove the Note
  const cardIndex = app.locals.cardList.findIndex(card => card.id == request.params.id)

  if( cardIndex == -1 ) return response.status(404).json('card not found');
  
  // ** We remove the card by splicing at said index
  app.locals.cardList.splice(cardIndex, 1);
    return response.sendStatus(204);
});

// ** API path for PUT Request, to edit existing Note
app.put('/api/v1/cardList/:id', (request, res) => {
  // ** First we extract the title & content from the request
  const { title, content } = request.body;
  // ** Next, extract the id from the path params
  let { id } = request.params;
  // ** Then declare a local cardlist, that we manipulate only in the scope of this function, before saving to app.locals
  let { cardList } = app.locals;

  // ** Here we want to make sure that as we map through our existing list, that we are not changing the wrong Note, but only the matching ID one.
  id = parseInt(id);
  // ** We will use this variable later to help decide errors
  let cardFound = false;
  const updatedCards = cardList.map(card => {
    if ( card.id == request.params.id) {
      cardFound = true;
      return { id, title, content };
    } else {
      return card;
    }
  });

  // ** Handle error of format issues
  if (!title || !content ) return response.status(422).json('Missing a title or content ');
  // ** Handle ID not found
  if (!cardFound) return response.status(404).json('card was not found')

  // ** Reassign our current scoped list to the global server data
  app.locals.cardList = updatedCards;
  return res.sendStatus(204)
})

// ** Export so that we can import in server.js file
module.exports= app 
