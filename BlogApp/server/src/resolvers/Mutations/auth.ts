import { Context } from "../../index";
import validator from "validator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import { JSON_SIGNATURE } from "../key";

interface SignupArgs {
  credentials: {
    email: string;
    password: string;
  };
  bio: string;
  name: string;
}

interface UserPayload {
  userError: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { credentials: { email, password }, name, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const isEmail = validator.isEmail(email);
    if (!isEmail) {
      return {
        userError: [{ message: "Invalid Email" }],
        token: null,
      };
    }

    const isValidPassword = validator.isLength(password, { min: 5 });
    if (!isValidPassword) {
      return {
        userError: [{ message: "Invalid Password" }],
        token: null,
      };
    }

    if (!name || !bio) {
      return {
        userError: [{ message: "Invalid name or bio" }],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    await prisma.profile.create({
      data: {
        bio,
        userId: user.id,
      },
    });

    const token = await JWT.sign(
      {
        userId: user.id,
      },
      JSON_SIGNATURE,
      {
        expiresIn: 360000,
      }
    );

    return {
      userError: [],
      token: token,
    };
  },

  signIn: async (
    _: any,
    { credentials: { email, password } }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        userError: [
          {
            message: "Invalid credentials",
          },
        ],
        token: null,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        userError: [
          {
            message: "Invalid credentials",
          },
        ],
        token: null,
      };
    }

    const token = await JWT.sign(
      {
        userId: user.id,
      },
      JSON_SIGNATURE,
      {
        expiresIn: 360000,
      }
    );

    return {
      userError: [],
      token: token,
    };
  },
};
