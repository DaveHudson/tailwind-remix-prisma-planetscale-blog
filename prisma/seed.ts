import { PrismaClient, Category } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  const dave = await prisma.user.create({
    data: {
      username: "David",
      // this is a hashed version of "twixrox"
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
      name: "Dave",
      profileUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  });

  await Promise.all(
    getPosts().map((post) => {
      const data = { userId: dave.id, ...post };
      return prisma.post.create({ data });
    })
  );
}

seed();

function getPosts() {
  return [
    {
      title: "Boost your conversion rate",
      body: "Nullam risus blandit ac aliquam justo ipsum. Quam mauris volutpat massa dictumst amet. Sapien tortor lacus arcu.",
      category: Category.ARTICLE,
      readingTime: "3 min read",
    },
    { title: "Post 2", body: "This is a test post seeded", category: Category.ARTICLE, readingTime: "1 min read" },
    { title: "Post 3", body: "This is a test post seeded", category: Category.CASE_STUDY, readingTime: "2 min read" },
  ];
}
