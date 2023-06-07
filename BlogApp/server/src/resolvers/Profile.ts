import { Context } from "..";

interface ProfileParentType {
  id: number;
  bio: string;
  userId: number;
}

const Profile = {
  user: (
    parent: ProfileParentType,
    args: any,
    { prisma, userInfo }: Context
  ) => {
    return prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    });
  },
};

export { Profile };
