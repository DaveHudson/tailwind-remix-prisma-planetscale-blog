import { useLoaderData, Link, useParams, redirect } from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";
import { getPost } from "~/utils/db/post.server";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.postid, "expected params.postid");

  const user = await getUser(request);

  const postid = params.postid;
  const post = await getPost({ postid });

  const data = { post, user };
  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  if (form.get("_method") === "delete") {
    const user = await getUser(request);

    const post = await db.post.findUnique({
      where: { id: Number(params.postid) },
    });

    if (!post) throw new Error("Post not found");

    if (user && post.userId === user.id) {
      await db.post.delete({ where: { id: Number(params.postid) } });
    }

    return redirect("/posts");
  }
};

export default function Post() {
  const { post, user } = useLoaderData();
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <Link to="/posts">Back</Link>

      {user?.id === post.userId && (
        <form method="POST">
          <input type="hidden" name="_method" value="delete" />
          <button type="submit">Delete</button>
        </form>
      )}
    </div>
  );
}
