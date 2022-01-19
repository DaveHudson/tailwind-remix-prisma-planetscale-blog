import { Category } from "@prisma/client";

type PostType = {
  category: Category;
};

export default function PostType(posttype: PostType) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
      {posttype.category}
    </span>
  );
}
