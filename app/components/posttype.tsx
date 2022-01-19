import { Category } from "@prisma/client";

type PostType = {
  category: Category;
};

export default function PostType(posttype: PostType) {
  switch (posttype.category) {
    case Category.ARTICLE:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
          Article
        </span>
      );
    case Category.CASE_STUDY:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium  bg-purple-100 text-purple-800">
          Case Study
        </span>
      );
    case Category.VIDEO:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800">
          Video
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
          Article
        </span>
      );
  }
}
