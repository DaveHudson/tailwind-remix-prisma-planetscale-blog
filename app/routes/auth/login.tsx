import { ExclamationCircleIcon } from "@heroicons/react/outline";
import { useActionData, json, useTransition, ActionFunction, Form } from "remix";
import { checkIfUserExists } from "~/utils/db/user.server";
import { login, register, createUserSession } from "~/utils/session.server";

function validateUsername(username: string) {
  if (typeof username !== "string" || username.length < 3) {
    return "username should be at least 3 characters long";
  }
}

function validatePassword(password: string) {
  if (typeof password !== "string" || password.length < 3) {
    return "password should be at least 3 characters long";
  }
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();

  const userCredentials = {
    username: form.get("username") as string,
    password: form.get("password") as string,
  };

  const errors = {
    username: validateUsername(userCredentials.username),
    password: validatePassword(userCredentials.password),
  };

  // Return errors
  if (Object.values(errors).some(Boolean)) {
    return json({ errors, userCredentials }, { status: 422 }); // Unprocessable entity
  }

  const loginType = form.get("loginType");
  const { username, password } = userCredentials;

  if (typeof loginType !== "string") {
    throw new Error(`Form not submmitted correctly`);
  }

  switch (loginType) {
    case "login": {
      // Find user
      const user = await login({ username, password });
      // Check user
      if (!user) {
        return json({ ...userCredentials, errors: { username: "Invalid credentials" } });
      }

      // Create user session
      return createUserSession(user.id, "/posts");
    }
    case "register": {
      // Check if user exists
      const userExists = await checkIfUserExists(username);
      if (userExists) {
        return json({ ...userCredentials, errors: { username: `User ${username} already exists` } });
      }

      // Create user
      const user = await register({ username, password });
      if (!user) {
        return json({ ...userCredentials, formError: "Something went wrong" });
      }

      // Create user session
      return createUserSession(user.id, "/posts");
    }
    default: {
      return json({ ...userCredentials, formError: "Login type is not valid" }, { status: 400 });
    }
  }
};

export default function Login() {
  const actionData = useActionData();
  const transition = useTransition();

  const accountOptions = [
    {
      id: "login",
      title: "Login",
    },
    {
      id: "register",
      title: "Register",
    },
  ];

  return (
    <div className="pt-5">
      <Form action="/auth/login" method="post">
        <label className="text-base font-medium text-gray-900">Login or Register</label>
        <p className="text-sm leading-5 text-gray-500">Do you want to login or register?</p>
        <fieldset className="mt-4">
          <legend className="sr-only">Login method</legend>
          <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
            {accountOptions.map((accountMethod) => (
              <div key={accountMethod.id} className="flex items-center">
                <input
                  id={accountMethod.id}
                  value={accountMethod.id}
                  name="loginType"
                  type="radio"
                  defaultChecked={accountMethod.id === "login"}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                />
                <label htmlFor={accountMethod.id} className="ml-3 block text-sm font-medium text-gray-700">
                  {accountMethod.title}
                </label>
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              username
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                name="username"
                id="username"
                className={`${
                  actionData?.errors.username
                    ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    : "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                }`}
                defaultValue={actionData?.fields?.username}
                aria-invalid="true"
                aria-describedby="username-error"
              />
              {actionData?.errors.username && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-red-600" id="username-error">
              {actionData?.errors.username && actionData?.errors.username}
            </p>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="password"
                name="password"
                id="password"
                className={`${
                  actionData?.errors.password
                    ? "block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                    : "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                }`}
                defaultValue={actionData?.fields?.password}
                aria-invalid="true"
                aria-describedby="password-error"
              />
              {actionData?.errors.password && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
              )}
            </div>
            <p className="mt-2 text-sm text-red-600" id="password-error">
              {actionData?.errors.password && actionData?.errors.password}
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {transition.state !== "idle" ? "Logging in..." : "Login"}
          </button>
        </fieldset>
      </Form>
    </div>
  );
}
