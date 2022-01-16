import { Link, useLoaderData } from "remix";
import { getUser } from "~/utils/session.server";

export const loader = async ({ request }: { request: Request }) => {
  const user = await getUser(request);
  const data = {
    user,
  };
  return data;
};

export default function Index() {
  const { user } = useLoaderData();
  return (
    <div>
      <h1 className="text-pink-700 text-4xl">Welcome</h1>
      <nav>
        <ul>
          <li>
            <Link to="posts">Posts</Link>
          </li>
          {user ? (
            <li>
              <form action="/auth/logout" method="POST">
                <button type="submit">Logout {user.username}</button>
              </form>
            </li>
          ) : (
            <li>
              <Link to="/auth/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
