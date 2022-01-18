import { useLoaderData, Link, useParams, redirect } from "remix";
import type { ActionFunction, LoaderFunction } from "remix";
import { getUser } from "~/utils/session.server";
import { deletePost, getPost } from "~/utils/db/post.server";
import invariant from "tiny-invariant";

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.postid, "expected params.postid");

  const user = await getUser(request);

  const postid = params.postid;
  const post = await getPost(Number(postid));

  const data = { post, user };
  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  // Check for delete methos
  if (form.get("_method") === "delete") {
    // Get user from cookie
    const user = await getUser(request);

    // Get post from db
    const { postid } = params;
    const post = await getPost(Number(postid));

    if (!post) throw new Error("Post not found");

    // delete ONLY if post created by logged in user
    if (user && post.userId === user.id) {
      await deletePost(Number(params.postid));
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
