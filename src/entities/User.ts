import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RandomTokenService } from "../services/RandomTokenService";
import { PostCategory } from "./PostCategory";

@Entity({ name: "user" })
export class User {
    @PrimaryGeneratedColumn({ type: "bigint" })
    public id?: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public name!: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public email!: string;

    @Column({ type: "char", length: 43, nullable: false })
    public password!: string;

    @Column({ type: "char", length: 43, nullable: false })
    public token!: string;

    @OneToMany(() => PostCategory, (postCategory) => postCategory.user)
    public postCategories!: PostCategory[];

    public constructor() {
        if (!this.id) this.generateRandomToken();
    }

    public generateRandomToken(): string {
        this.token = RandomTokenService.make();

        return this.token;
    }

    public canDelete(user: User): boolean {
        return this.token == user.token;
    }

    public canUpdate(user: User): boolean {
        return this.token == user.token;
    }
}
