import { Context } from "..";

const Query = {
  posts: (parent: any, args: any, { prisma }: Context) => {
    return prisma.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};

export { Query };
