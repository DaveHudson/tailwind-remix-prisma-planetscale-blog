import { Link, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { db } from "~/utils/db.server";
import { Post, User } from "@prisma/client";
import dayjs from "dayjs";

interface PostWithUser extends Post {
  user: User;
}

export const loader: LoaderFunction = async () => {
  const data = {
    posts: await db.post.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
      },
    }),
  };
  return data;
};

export default function Posts() {
  const { posts } = useLoaderData();

  return (
    <div className="mt-12 grid gap-16 pt-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
      {posts.map((post: PostWithUser) => {
        return (
          <div key={post.title}>
            <div>
              <a href={`${post.id}`} className="inline-block">
                <span>{post.category}</span>
              </a>
            </div>
            <Link to={`${post.id}`} className="block mt-4">
              <p className="text-xl font-semibold text-gray-900">{post.title}</p>
              <p className="mt-3 text-base text-gray-500">{post.body}</p>
            </Link>
            <div className="mt-6 flex items-center">
              <div className="flex-shrink-0">
                <Link to={`${post.userId}`}>
                  <span className="sr-only">{post.user.name}</span>
                  <img
                    className="h-10 w-10 rounded-full"
                    src={`${post.user.profileUrl}`}
                    alt={post.user.name || "user profile photo"}
                  />
                </Link>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  <Link to={`/user/${post.userId}`}>{post.title}</Link>
                </p>
                <div className="flex space-x-1 text-sm text-gray-500">
                  <span>{dayjs(post.createdAt).format("MMM D, YYYY")}</span>
                  <span aria-hidden="true">&middot;</span>
                  <span>{post.readingTime} read</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
