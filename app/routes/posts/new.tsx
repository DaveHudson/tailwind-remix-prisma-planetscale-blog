import { Link, redirect, useActionData, json } from "remix";
import type { ActionFunction } from "remix";
import { getUser } from "~/utils/session.server";
import { createPost, CreatePostInputType } from "~/utils/db/post.server";
import { Category } from "@prisma/client";

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);

  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");
  const category = Category.ARTICLE;
  const imageUrl = "";
  const readingTime = "";

  const fields = { title, body, category, imageUrl, readingTime, userId: user?.id } as CreatePostInputType;

  const post = await createPost(fields);

  return redirect(`/posts/${post}`);
};

export default function NewPost() {
  const actionData = useActionData();

  return (
    <div>
      <p>This is for a new post</p>
      <Link to="/posts">Back</Link>

      <form method="POST">
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" id="title" defaultValue={actionData?.fields?.title} />
          <p>{actionData?.fieldErrors.title && actionData?.fieldErrors.title}</p>
        </div>
        <div>
          <label htmlFor="body">Body</label>
          <textarea name="body" id="body" defaultValue={actionData?.fields?.body} />
          <p>{actionData?.fieldErrors.body && actionData?.fieldErrors.body}</p>
        </div>
        <button type="submit">Add Post</button>
      </form>
    </div>
  );
}
