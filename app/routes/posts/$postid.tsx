import { useLoaderData, Link, useParams, redirect, useTransition, Form } from "remix";
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
  const transition = useTransition();

  return (
    <div className="mt-12 pt-12 pb-12 prose">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <Link to="/posts">Back</Link>

      {user?.id === post.userId && (
        <div className="pt-3">
          <Form method="post">
            <input type="hidden" name="_method" value="delete" />
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {transition.state !== "idle" ? "Deleting.." : "Delete"}
            </button>
          </Form>
        </div>
      )}
    </div>
  );
}
