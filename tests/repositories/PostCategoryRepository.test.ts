import { describe, it, before, after, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { PostCategoryRepository } from "../../src/repositories/PostCategoryRepository";
import { PostCategory } from "../../src/entities/PostCategory";
import dataSource from "../../src/dataSource";
import { UserRepository } from "../../src/repositories/UserRepository";
import { User } from "../../src/entities/User";
import { HashService } from "../../src/services/HashService";

describe("PostCategoryRepository", () => {
    let user: User;
    before(async () => {
        await dataSource.initialize();
        user = new User();
        user.name = "Test User";
        user.email = "test@test.com";
        user.password = HashService.make("password");
        await UserRepository.save(user);
    });

    after(async () => {
        await UserRepository.delete({});
        await dataSource.destroy();
    });

    afterEach(async () => {
        await PostCategoryRepository.clear();
    });

    it("should save a new PostCategory", async () => {
        const postCategory = new PostCategory();
        postCategory.name = "Technology";
        postCategory.user = user;

        const savedCategory = await PostCategoryRepository.save(postCategory);

        assert(savedCategory);
        assert(savedCategory.id);
        assert.equal(savedCategory.name, "Technology");
    });

    it("should find a PostCategory by ID", async () => {
        const postCategory = new PostCategory();
        postCategory.name = "Science";
        postCategory.user = user;

        const savedCategory = await PostCategoryRepository.save(postCategory);
        const foundCategory = await PostCategoryRepository.findOneBy({
            id: savedCategory.id,
        });

        assert(foundCategory);
        assert.equal(foundCategory?.id, savedCategory.id);
        assert.equal(foundCategory?.name, "Science");
    });

    it("should update a PostCategory", async () => {
        const postCategory = new PostCategory();
        postCategory.name = "Health";
        postCategory.user = user;

        const savedCategory = await PostCategoryRepository.save(postCategory);
        savedCategory.name = "Wellness";

        const updatedCategory = await PostCategoryRepository.save(
            savedCategory
        );

        assert(updatedCategory);
        assert.equal(updatedCategory.id, savedCategory.id);
        assert.equal(updatedCategory.name, "Wellness");
    });

    it("should delete a PostCategory", async () => {
        const postCategory = new PostCategory();
        postCategory.user = user;
        postCategory.name = "Lifestyle";

        const savedCategory = await PostCategoryRepository.save(postCategory);
        await PostCategoryRepository.remove(savedCategory);

        const foundCategory = await PostCategoryRepository.findOneBy({
            id: savedCategory.id,
        });

        assert.equal(foundCategory, null);
    });

    it("should retrieve all PostCategories", async () => {
        const category1 = new PostCategory();
        category1.name = "Travel";

        const category2 = new PostCategory();
        category2.name = "Food";

        await PostCategoryRepository.save([category1, category2]);

        const categories = await PostCategoryRepository.find();

        assert.equal(categories.length, 2);
        assert.deepEqual(categories.map((c) => c.name).sort(), [
            "Food",
            "Travel",
        ]);
    });
});
