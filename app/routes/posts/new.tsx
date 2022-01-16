import { Link, redirect, useActionData, json } from "remix";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

function validateTitle(title: string) {
  if (typeof title !== "string" || title.length < 3) {
    return "Title should be at least 3 characters long";
  }
}

function validateBody(body: string) {
  if (typeof body !== "string" || body.length < 10) {
    return "Body should be at least 10 characters long";
  }
}

export const action = async ({ request }: { request: any }) => {
  const form = await request.formData();
  const title = form.get("title");
  const body = form.get("body");
  const user = await getUser(request);
  console.log("request in new", request);
  console.log("user in new", user);

  const fields = { title, body };

  const fieldErrors = {
    title: validateTitle(title),
    body: validateBody(body),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    console.log(fieldErrors);
    return json({ fieldErrors, fields }, { status: 400 });
  }

  // @ts-ignore
  const post = await db.post.create({ data: { ...fields, userId: user?.id } });

  return redirect(`/posts/${post.id}`);
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
