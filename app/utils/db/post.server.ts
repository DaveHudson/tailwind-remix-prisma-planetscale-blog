import { Category, Post, User } from "@prisma/client";
import { json } from "remix";
import invariant from "tiny-invariant";
import { db } from "~/utils/db.server";

export interface PostWithUser extends Post {
  user: User;
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

export async function getPosts() {
  const posts = await db.post.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
    },
  });
  return posts as PostWithUser[];
}

export async function getPost({ postid }: { postid: string }) {
  const post = await db.post.findUnique({
    where: { id: Number(postid) },
    include: {
      user: true,
    },
  });

  if (!post) throw new Error("Post not found");

  return post as PostWithUser;
}

export type CreatePostInputType = {
  title: string;
  body: string;
  category: Category;
  imageUrl: string;
  readingTime: string;
  userId: number;
};

export async function createPost(fields: CreatePostInputType) {
  invariant(fields.title, "expected post title");
  invariant(fields.body, "expected post body");
  invariant(fields.userId, "expected user id");

  const fieldErrors = {
    title: validateTitle(fields.title),
    body: validateBody(fields.body),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return json({ fieldErrors, fields }, { status: 400 });
  }

  const res = await db.post.create({ data: { ...fields, userId: fields.userId } });

  return res.id;
}
