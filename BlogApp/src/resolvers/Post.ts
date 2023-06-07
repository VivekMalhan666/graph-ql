import { Context } from "..";
import { userLoader } from "../loader/userLoader";

interface PostParentType {
  authorId: number;
  bio: string;
  userId: number;
}

const Post = {
  user: (parent: PostParentType, args: any, { prisma }: Context) => {
    return userLoader.load(parent.authorId);
  },
};

export { Post };
