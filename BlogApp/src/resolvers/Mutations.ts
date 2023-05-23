import { Post } from "@prisma/client";
import { Context } from "../index";

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

const Mutation = {
  postCreate: async (
    parent: any,
    args: PostArgs,
    { prisma }: Context
  ): Promise<PostPayloadType> => {
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
        authorId: 1,
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
    { prisma }: Context
  ): Promise<PostPayloadType> => {
    const {
      post: { title, content },
      postId,
    } = args;
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
    return {
      userErrors: [],
      post: prisma.post.update({
        data: {
          ...payloadToUpdate,
        },
        where: {
          id: Number(postId),
        },
      }),
    };
  },
  postDelete: async (
    parent: any,
    { postId }: { postId: string },
    { prisma }: Context
  ): Promise<PostPayloadType> => {
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
};
export { Mutation };
