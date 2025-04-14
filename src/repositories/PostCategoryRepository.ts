import dataSource from "../dataSource";
import { PostCategory } from "../entities/PostCategory";

export const PostCategoryRepository = dataSource.getRepository(PostCategory);
