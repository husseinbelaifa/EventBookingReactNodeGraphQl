const express = require("express");
const bodyParser = require("body-parser");
const graphQlHttp = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const Event = require("./models/event");
const User = require("./models/user");
const bcrypt = require("bcryptjs");

const app = express();

app.use(bodyParser.json());

// const user = userId => {
//   return User.findById(userId)
//     .then(user => {

//       return {
//         ...user._doc,
//         createdEvent: () => events(newUser)
//       };
//     })
//     .catch(err => {
//       throw err;
//     });
// };

// const events = eventIds => {
//   console.log(eventIds);
//   return Event.find({ _id: { $in: eventIds } })
//     .then(events => {
//       return events.map(event => {
//         return { ...event._doc, creator: user.bind(this, event._doc.creator) };
//       });
//     })
//     .catch(err => {
//       throw err;
//     });
// };

app.use(
  "/graphql",
  graphQlHttp({
    schema: buildSchema(`
    type Event {
        _id:ID!
        title:String!
        description:String! 
        price:Float! 
        date:String! 
        creator:User!


    }

    type User {
        _id:ID!
        email:String!
        password:String,
        createdEvent:[Event!]
    }


    input EventInput {
        title:String!
        description:String! 
        price:Float! 
        date:String! 

    }

    input UserInput {
        email:String! 
        password:String!
    }

  
    type RootQuery {
        events:[Event!]!
       
    }

    type RootMutation{

        createEvent(eventInput:EventInput):Event
        createUser(userInput:UserInput):User

    }
     schema {
         query:RootQuery
         mutation:RootMutation

     }
    `),
    rootValue: {
      events: () => {
        return Event.find()
          .populate({
            path: "creator",
            populate: {
              path: "createdEvent"
            }
          })
          .then(events => {
            return events.map(event => {
              return {
                ...event._doc
                // creator: user.bind(this, event._doc.creator)
              };
            });
          })
          .catch(err => {
            throw err;
          });
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "5d248d3f543a9b0e7cb5248e"
        });

        let createdEvent;

        return event
          .save()
          .then(eventSaved => {
            createdEvent = { ...eventSaved._doc };
            return User.findById("5d248d3f543a9b0e7cb5248e");
            // console.log(eventSaved);
            // return { ...eventSaved._doc };
          })
          .then(user => {
            if (!user) throw new Error("User not found");

            user.createdEvent.push(event);
            return user.save();
          })
          .then(userSaved => {
            return Event.findById(createdEvent._id)
              .populate({ path: "creator", populate: { path: "createdEvent" } })
              .then(eventFound => {
                return eventFound;
              });
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },

      createUser: args => {
        return User.findOne({ email: args.userInput.email }).then(user => {
          if (user) throw new Error("User already exist");
          else {
            return bcrypt
              .hash(args.userInput.password, 12)
              .then(hashedPassword => {
                const user = new User({
                  email: args.userInput.email,
                  password: hashedPassword
                });

                return user.save();
              })
              .then(userSaved => {
                return { ...userSaved._doc, password: null };
              })
              .catch(err => {
                throw err;
              });
          }
        });
      }
    },

    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${
      process.env.MONGO_PASSWORD
    }@cluster0-3c0xg.mongodb.net/${
      process.env.MONGO_DB
    }?retryWrites=true&w=majority`
  )
  .then(() => console.log("connect to mongo"))
  .catch(err => console.log(err));

app.listen(3000, () => console.log("server is runnning"));
