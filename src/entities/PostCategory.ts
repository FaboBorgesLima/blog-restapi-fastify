import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity({ name: "post_category" })
export class PostCategory {
    @PrimaryGeneratedColumn({ type: "bigint" })
    public id?: string;

    @Column({ type: "varchar", length: 255, nullable: false })
    public name!: string;

    @Column({ type: "timestamp", default: () => "now()" })
    public createdAt!: Date;

    @Column({ type: "timestamp", default: () => "now()" })
    public updatedAt!: Date;

    @Column({ type: "timestamp", nullable: true })
    public deletedAt?: Date;

    @ManyToOne(() => User, (user) => user.postCategories)
    public user!: User;
}
