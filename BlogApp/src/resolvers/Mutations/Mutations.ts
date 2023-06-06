import { authResolvers } from "./auth";
import { postResolvers } from "./post";

const Mutation = {
  ...postResolvers,
  ...authResolvers,
};
export { Mutation };
