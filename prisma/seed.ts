import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  const dave = await prisma.user.create({
    data: {
      username: "David",
      // this is a hashed version of "twixrox"
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
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
      title: "Post 1",
      body: "This is a test post seeded, this one is very long and hopefully should break the seed script running because the type of field will not accept long values. I think 191 was the maximum so lets make sure this is looooooooooongeeeeeeeeer that that!",
    },
    { title: "Post 2", body: "This is a test post seeded" },
    { title: "Post 3", body: "This is a test post seeded" },
  ];
}
