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
    <div className="mt-12 grid gap-16 pt-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
      {posts.map((post: Post) => (
        <div key={post.title}>
          <div>
            <a href={`${post.id}`} className="inline-block">
              <span>{post.category}</span>
            </a>
          </div>
          <a href={`${post.id}`} className="block mt-4">
            <p className="text-xl font-semibold text-gray-900">{post.title}</p>
            <p className="mt-3 text-base text-gray-500">{post.body}</p>
          </a>
          <div className="mt-6 flex items-center">
            <div className="flex-shrink-0">
              <a href={`${post.userId}`}>
                <span className="sr-only">{post.userId}</span>
                <img className="h-10 w-10 rounded-full" src={`${post.userId}`} alt="" />
              </a>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                <a href={`${post.userId}`}>{post.title}</a>
              </p>
              <div className="flex space-x-1 text-sm text-gray-500">
                <time dateTime={post.createdAt.toString()}>{post.createdAt}</time>
                <span aria-hidden="true">&middot;</span>
                <span>{post.readingTime} read</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // return (
  //   <div>
  //     <p>Posts</p>
  //     <Link to="/posts/new">New Post</Link>
  //     <ul>
  //       {posts.map((post: Post) => (
  //         <li key={`${post.id}`}>
  //           <Link to={`${post.id}`}>
  //             <h3>{post.title}</h3>
  //             {new Date(post.createdAt).toLocaleString()}
  //           </Link>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
}
