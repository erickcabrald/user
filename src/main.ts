import fastify from '../node_modules/fastify/fastify';

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
  return reply.status(200).send(user);
});
