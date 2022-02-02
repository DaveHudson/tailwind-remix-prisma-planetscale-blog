import { redirect, useActionData, json, Form, useTransition } from "remix";
import type { ActionFunction } from "remix";
import { getUser } from "~/utils/session.server";
import { createPost } from "~/utils/db/post.server";
import { Post, Prisma } from "@prisma/client";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import invariant from "tiny-invariant";
import { useState } from "react";
import { Tab } from "@headlessui/react";
import { AtSymbolIcon, CodeIcon, LinkIcon } from "@heroicons/react/solid";
import { marked } from "marked";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

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
    description: "the best 90's tunes",
    body: form.get("body"),
    tags: [] as Prisma.JsonArray,
    imageUrl: "http",
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
  const transition = useTransition();

  const [text, setText] = useState("");

  return (
    <Form method="post" className="space-y-8 divide-y divide-gray-200">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <h3 className="text-lg leading-6 font-medium text-light dark:text-dark">New Post</h3>
          <p className="mt-1 text-sm text-light-accent dark:text-dark-accent">
            Use this form to create a new blog post using markdown syntax.
          </p>
        </div>

        <fieldset disabled={transition.state === "submitting"} className="pt-6">
          <label htmlFor="title" className="block text-sm font-medium text-light-accent dark:text-dark-accent">
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

          <div className="pt-6">
            <Tab.Group>
              {({ selectedIndex }) => (
                <>
                  <Tab.List className="flex items-center">
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "text-gray-900 bg-gray-100 hover:bg-gray-200"
                            : "text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100",
                          "px-3 py-1.5 border border-transparent text-sm font-medium rounded-md"
                        )
                      }
                    >
                      Write
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        classNames(
                          selected
                            ? "text-gray-900 bg-gray-100 hover:bg-gray-200"
                            : "text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100",
                          "ml-2 px-3 py-1.5 border border-transparent text-sm font-medium rounded-md"
                        )
                      }
                    >
                      Preview
                    </Tab>

                    {/* These buttons are here simply as examples and don't actually do anything. */}
                    {selectedIndex === 0 ? (
                      <div className="ml-auto flex items-center space-x-5">
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="-m-2.5 w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Insert link</span>
                            <LinkIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="-m-2.5 w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Insert code</span>
                            <CodeIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="flex items-center">
                          <button
                            type="button"
                            className="-m-2.5 w-10 h-10 rounded-full inline-flex items-center justify-center text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Mention someone</span>
                            <AtSymbolIcon className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </Tab.List>
                  <Tab.Panels className="mt-2">
                    <Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
                      <label htmlFor="body" className="sr-only">
                        Body
                      </label>
                      <div>
                        <textarea
                          rows={5}
                          name="body"
                          id="body"
                          className={`${
                            actionData?.errors.title
                              ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                              : "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          }`}
                          defaultValue={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </div>
                    </Tab.Panel>
                    <Tab.Panel className="p-0.5 -m-0.5 rounded-lg">
                      <div className="border-b">
                        <div
                          className="mx-px mt-px px-3 pt-2 pb-12 text-sm leading-5 prose prose-pink dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: marked(text) }}
                        ></div>
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </>
              )}
            </Tab.Group>

            <p className="mt-2 text-sm text-red-600" id="body-error">
              {actionData?.errors.body && actionData?.errors.body}
            </p>

            <p className="mt-2 text-sm text-red-600" id="userid-error">
              {actionData?.errors.userId && actionData?.errors.userId}
            </p>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {transition.state !== "idle" ? "Adding post..." : "Add post"}
              </button>
            </div>
          </div>
        </fieldset>
      </div>
    </Form>
  );
}
