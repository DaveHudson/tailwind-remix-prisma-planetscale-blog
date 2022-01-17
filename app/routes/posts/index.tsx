import { Link, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { db } from "~/utils/db.server";
import { Post } from "@prisma/client";

export const loader: LoaderFunction = async () => {
  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: { id: true, title: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
  };
  return data;
};

export default function NewPost() {
  const { posts } = useLoaderData();
  console.log(posts);
  return (
    <div>
      <p>Posts</p>
      <Link to="/posts/new">New Post</Link>
      <ul>
        {posts.map((post: Post) => (
          <li key={`${post.id}`}>
            <Link to={`${post.id}`}>
              <h3>{post.title}</h3>
              {new Date(post.createdAt).toLocaleString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
