import { prisma } from '../../database.js';
import { signToken } from '../auth.js';
import { encryptPassword, verifyPassword } from './model.js';

export async function signup(req, res, next) {
  const { body = {} } = req;

  try {
    const password = await encryptPassword(body.password);
    const user = await prisma.user.create({
      data: { ...body, password },
      select: { id: true, email: true, username: true },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  const { body } = req;
  const { email, password } = body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
        photo: true,
      },
    });

    if (user === null) {
      return next({
        message: 'Invalid email or password',
        status: 400,
      });
    }

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
      return next({
        message: 'Invalid email or password',
        status: 400,
      });
    }

    const { id, username } = user;
    const token = signToken({ id, username });

    res.json({
      ...user,
      id: undefined,
      password: undefined,
      token,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  const { body = {}, params = {} } = req;
  const { username } = params;

  try {
    const result = await prisma.user.update({
      where: {
        username,
      },
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
      select: {
        email: true,
        username: true,
        photo: true,
      },
    });

    res.json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
