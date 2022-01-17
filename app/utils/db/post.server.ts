import { Post, User } from "@prisma/client";
import { db } from "~/utils/db.server";

export interface PostWithUser extends Post {
  user: User;
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
