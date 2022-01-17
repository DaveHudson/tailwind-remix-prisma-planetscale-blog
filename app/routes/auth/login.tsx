import { useActionData, json, redirect } from "remix";
import { db } from "~/utils/db.server";
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

export const action = async ({ request }: { request: Request }) => {
  const form = await request.formData();

  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");

  if (typeof loginType !== "string") {
    throw new Error(`Form not submmitted correctly`);
  }
  if (typeof username !== "string") {
    throw new Error(`Form not submmitted correctly`);
  }
  if (typeof password !== "string") {
    throw new Error(`Form not submmitted correctly`);
  }

  const fields = { loginType, username, password };

  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return json({ fieldErrors, fields }, { status: 400 });
  }

  switch (loginType) {
    case "login": {
      // Find user
      const user = await login({ username, password });
      // Check user
      if (!user) {
        return json({ ...fields, fieldErrors: { username: "Invalid credentials" } });
      }

      // Create user session
      return createUserSession(user.id, "/posts");
    }
    case "register": {
      // Check if user exists
      const userExists = await db.user.findFirst({
        where: {
          username,
        },
      });

      if (userExists) {
        return json({ ...fields, fieldErrors: { username: `User ${username} already exists` } });
      }

      // Create user

      const user = await register({ username, password });

      if (!user) {
        return json({ ...fields, formError: "Something went wrong" });
      }

      // Create user session
      return createUserSession(user.id, "/posts");
    }
    default: {
      return json({ ...fields, formError: "Login type is not valid" }, { status: 400 });
    }
  }
};

export default function Login() {
  const actionData = useActionData();

  return (
    <div>
      <h1>Login</h1>
      <form action="/auth/login" method="POST">
        <fieldset>
          <legend>Login or Register</legend>
          <label>
            <input
              type="radio"
              name="loginType"
              value="login"
              defaultChecked={!actionData?.fields?.loginType || actionData?.fields?.loginType === "login"}
            />
            Login
          </label>

          <label>
            <input type="radio" name="loginType" value="register" />
            Register
          </label>
        </fieldset>

        <div>
          <label htmlFor="username">Username</label>
          <input type="text" name="username" id="username" defaultValue={actionData?.fields?.username} />
          <p>{actionData?.fieldErrors.username && actionData?.fieldErrors.username}</p>
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" defaultValue={actionData?.fields?.password} />
          <p>{actionData?.fieldErrors.password && actionData?.fieldErrors.password}</p>
        </div>

        <button type="submit">Login!</button>
      </form>
    </div>
  );
}
