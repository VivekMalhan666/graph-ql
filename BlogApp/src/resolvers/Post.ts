import { Context } from "..";

interface PostParentType {
  authorId: number;
  bio: string;
  userId: number;
}

const Post = {
  user: (parent: PostParentType, args: any, { prisma }: Context) => {
    return prisma.user.findUnique({
      where: {
        id: parent.authorId,
      },
    });
  },
};

export { Post };
