import fastify from 'fastify';

const app = fastify();

type User = [
  {
    name: string;
    age: number;
    email: string;
    password: string;
  },
];

let user: User = [
  {
    name: 'jeferson mendes',
    age: 23,
    email: 'jeferson76@gmail.com',
    password: 'fejsf',
  },
];

app.get('/user', (request, reply) => {
  return user;
});
