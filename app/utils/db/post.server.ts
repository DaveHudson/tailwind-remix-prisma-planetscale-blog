import { Post, User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { marked } from "marked";

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

export async function getPost(postid: number) {
  const post = await db.post.findUnique({
    where: { id: postid },
    include: {
      user: true,
    },
  });

  if (!post) throw new Error("Post not found");

  const postHtml = marked(post.body);

  const postData = {
    ...post,
    body: postHtml,
  };

  return postData as PostWithUser;
}

export async function createPost(fields: Post) {
  const res = await db.post.create({ data: { ...fields, userId: fields.userId } });
  return res.id;
}

export async function deletePost(postid: number) {
  const res = await db.post.delete({ where: { id: postid } });
  return res;
}
