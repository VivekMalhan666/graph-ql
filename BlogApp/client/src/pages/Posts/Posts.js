import React from "react";
import Post from "../../components/Post/Post";
import { gql, useQuery } from "@apollo/client";

const GET_POSTS = gql`
  query {
    post {
      title
      content
      createdAt
      user {
        name
      }
    }
  }
`;
export default function Posts() {
  const { data, error, loading } = useQuery(GET_POSTS);
  if (error) return <div>Error Page</div>;
  if (loading) return <div>Spinner....</div>;
  const { posts } = data;
  return (
    <div>
      {posts.map((post) => (
        <Post
          key={post.id}
          title={post.title}
          content={post.content}
          date={post.createdAt}
          id={post.id}
          user={post.user.name}
        />
      ))}
    </div>
  );
}
