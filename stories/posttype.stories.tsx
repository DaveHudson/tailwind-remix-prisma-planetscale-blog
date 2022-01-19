import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PostType from "../app/components/posttype";
import { Category } from "@prisma/client";

export default {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: "PostType",
  component: PostType,
} as ComponentMeta<typeof PostType>;

export const Article: ComponentStory<typeof PostType> = () => <PostType category={Category.ARTICLE} />;

export const CaseStudy: ComponentStory<typeof PostType> = () => <PostType category={Category.CASE_STUDY} />;

export const Video: ComponentStory<typeof PostType> = () => <PostType category={Category.VIDEO} />;
