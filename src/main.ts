import fastify from 'fastify';
import { z } from 'zod';

const app = fastify();

type User = {
  name: string;
  age: number;
  email: string;
  password: string;
  id: number;
}[];

let users: User = [
  {
    name: 'jeferson mendes',
    age: 23,
    email: 'jeferson76@gmail.com',
    password: 'fejsf',
    id: 1,
  },
];

app.get('/user', (request, reply) => {
  return reply.status(200).send(users);
});

app.post('/user', (request, reply) => {
  //Schema para validar os dados com Zod
  const Schema = z.object({
    name: z.string().min(4, { message: 'Name is required' }),
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

  const emailExists = users.some((u) => u.email === email);
  if (emailExists) {
    return reply.status(400).send({ error: 'Este email já está em uso' });
  }

  const newUser = {
    name,
    age,
    email,
    password,
    id: users.length + 1,
  };

  users.push(newUser);
  return reply.status(201).send(newUser);
});

app.put('/user/:id', (request, reply) => {
  const { id } = request.params as { id: number };

  // Schema de validação com Zod
  const Schema = z.object({
    name: z.string().min(4).optional(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .optional(),
  });

  // Valida o corpo da requisição
  const result = Schema.safeParse(request.body);

  if (!result.success) {
    return reply.status(400).send({ error: result.error.format() });
  }

  // Encontrar o usuário pelo ID
  const userIndex = users.findIndex((u) => u.id === Number(id));

  if (userIndex === -1) {
    return reply.status(404).send({ error: 'User não esxiste' });
  }

  // Atualizar as informações permitidas
  const updatedUser = { ...users[userIndex], ...result.data };

  users[userIndex] = updatedUser;

  return reply.status(200).send(updatedUser);
});

app.listen({
  port: 3333,
});
