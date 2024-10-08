import fastify from 'fastify';
import { string, z } from 'zod';

const app = fastify();

type User = {
  name: string;
  age: number;
  email: string;
  password: string;
}[];

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

app.post('/user', (request, reply) => {
  //Schema para validar os dados com Zod
  const Schema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    age: z.number().min(12, { message: 'Age must be at least 12' }),
    email: z.string().email({ message: 'Invalid email format' }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters',
    }),
  });

  // Valida o request.body usando o esquema Zod
  const result = Schema.safeParse(request.body);

  if (!result.success) {
    // Se a validação falhar, retornar um erro com os detalhes
    return reply.status(400).send({ error: result.error.format() });
  }

  const { name, age, email, password } = result.data;

  const newUser = {
    name,
    age,
    email,
    password,
  };

  user.push(newUser);
  return reply.status(201).send(newUser);
});

app.listen({
  port: 3333,
});
