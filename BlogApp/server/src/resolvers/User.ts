import { Context } from "..";

interface UserParentType {
  id: number;
}

const User = {
  post: (parent: UserParentType, args: any, { prisma, userInfo }: Context) => {
    const isOwnProfile = parent.id === userInfo?.userId;

    if (isOwnProfile) {
      return prisma.post.findMany({
        where: {
          authorId: parent.id,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    } else
      return prisma.post.findMany({
        where: {
          authorId: parent.id,
          published: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
  },
};

export { User };
