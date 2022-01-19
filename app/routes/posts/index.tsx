import { Link, useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import dayjs from "dayjs";
import { getPosts, PostWithUser } from "~/utils/db/post.server";
import PostType from "~/components/posttype";

export const loader: LoaderFunction = async () => {
  return getPosts();
};

export default function Posts() {
  const posts = useLoaderData<PostWithUser[]>();

  return (
    <div className="mt-12 grid gap-16 pt-12 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12 pb-12">
      {posts.map((post) => {
        return (
          <div key={post.title}>
            <div>
              <a href={`${post.id}`} className="inline-block" title="post type">
                <PostType category={post.category} />
              </a>
            </div>
            <Link to={`${post.id}`} className="block mt-4" prefetch="intent">
              <p className="text-xl font-semibold text-gray-900">{post.title}</p>
              <p className="mt-3 text-base text-gray-500 line-clamp-3">{post.body}</p>
            </Link>
            <div className="mt-6 flex items-center">
              <div className="flex-shrink-0">
                <Link to={`${post.userId}`} prefetch="intent">
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
                  <Link to={`/user/${post.userId}`} prefetch="intent">
                    {post.title}
                  </Link>
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
