import { Link, redirect, useActionData, json, Form } from "remix";
import type { ActionFunction } from "remix";
import { getUser } from "~/utils/session.server";
import { createPost, CreatePostInputType } from "~/utils/db/post.server";
import { Category, Post } from "@prisma/client";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import invariant from "tiny-invariant";

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

function validateUserId(userId: number) {
  if (typeof userId === undefined) {
    return "Expected a user id";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const user = await getUser(request);
  invariant(user?.id, "expected user id");

  const form = await request.formData();

  const post = {
    title: form.get("title"),
    body: form.get("body"),
    category: Category.ARTICLE,
    imageUrl: "http",
    readingTime: "3 mins",
    userId: user.id,
  } as Post;

  const errors = {
    title: validateTitle(post.title),
    body: validateBody(post.body),
    category: "",
    imageUrl: "",
    readingTime: "",
    userId: validateUserId(post.userId),
  };

  // Return errors
  if (Object.values(errors).some(Boolean)) {
    return json({ errors, post }, { status: 422 }); // Unprocessable entity
  }

  await createPost(post);

  return redirect(`/posts`);
};

export default function NewPost() {
  const actionData = useActionData();

  return (
    <div>
      <p>This is for a new post</p>
      <Link to="/posts">Back</Link>

      <Form method="post">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              name="title"
              id="title"
              className={`${
                actionData?.errors.title
                  ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  : "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              }`}
              defaultValue={actionData?.fields?.title}
              aria-invalid="true"
              aria-describedby="title-error"
            />
            {actionData?.errors.title && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-red-600" id="title-error">
            {actionData?.errors.title && actionData?.errors.title}
          </p>
        </div>

        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700">
            Add your post body
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              name="body"
              id="body"
              className={`${
                actionData?.errors.title
                  ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                  : "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              }`}
              defaultValue={actionData?.fields?.body}
            />
          </div>
          <p className="mt-2 text-sm text-red-600" id="body-error">
            {actionData?.errors.body && actionData?.errors.body}
          </p>
        </div>

        <p className="mt-2 text-sm text-red-600" id="userid-error">
          {actionData?.errors.userId && actionData?.errors.userId}
        </p>

        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Post
        </button>
      </Form>
    </div>
  );
}
