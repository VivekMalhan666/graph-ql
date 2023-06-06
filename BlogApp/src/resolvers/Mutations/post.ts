import { Post } from "@prisma/client";
import { Context } from "../../index";
import { canUserMutatePost } from "../../utils/canUserMutatePost";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors: { message: string }[];
  post: Post | null;
}

export const postResolvers = {
  postCreate: async (
    parent: any,
    args: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "You must be authenticated to create a post",
          },
        ],
        post: null,
      };
    }
    const {
      post: { title, content },
    } = args;
    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "You must provide a title and content to add a post",
          },
        ],
        post: null,
      };
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userInfo.userId,
      },
    });
    return {
      userErrors: [],
      post,
    };
  },

  postUpdate: async (
    parent: any,
    args: { post: PostArgs["post"]; postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "You must be authenticated to create a post",
          },
        ],
        post: null,
      };
    }

    const {
      post: { title, content },
      postId,
    } = args;

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (error) return error;

    if (!title && !content) {
      return {
        userErrors: [{ message: "Need at least one field to update" }],
        post: null,
      };
    }
    const existingPost = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!existingPost) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }
    let payloadToUpdate = {
      title,
      content,
    };
    if (!title) delete payloadToUpdate.title;
    if (!content) delete payloadToUpdate.content;
    const updatedPost = await prisma.post.update({
      data: {
        ...payloadToUpdate,
      },
      where: {
        id: Number(postId),
      },
    });
    return {
      userErrors: [],
      post: updatedPost,
    };
  },

  postDelete: async (
    parent: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "You must be authenticated to create a post",
          },
        ],
        post: null,
      };
    }
    const postToDelete = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!postToDelete) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (error) return error;
    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });
    return {
      userErrors: [],
      post: postToDelete,
    };
  },
  postPublish: async (
    parent: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "You must be authenticated to create a post",
          },
        ],
        post: null,
      };
    }
    const postToUpdate = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!postToUpdate) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (error) return error;
    const updatedPost = await prisma.post.update({
      data: {
        published: true,
      },
      where: {
        id: Number(postId),
      },
    });
    return {
      userErrors: [],
      post: updatedPost,
    };
  },
  postUnpublish: async (
    parent: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "You must be authenticated to create a post",
          },
        ],
        post: null,
      };
    }
    const postToUpdate = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });
    if (!postToUpdate) {
      return {
        userErrors: [{ message: "Post does not exist" }],
        post: null,
      };
    }
    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });
    if (error) return error;
    const updatedPost = await prisma.post.update({
      data: {
        published: false,
      },
      where: {
        id: Number(postId),
      },
    });
    return {
      userErrors: [],
      post: updatedPost,
    };
  },
};
