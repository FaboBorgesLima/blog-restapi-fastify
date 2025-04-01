import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { RandomTokenService } from "../services/RandomTokenService";
import { PublicUserSchemaType } from "../Schemas/User/SerializedUserSchema";
import { UserSchemaType } from "../Schemas/User/UserSchema";

@Entity()
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

    public constructor() {
        if (!this.id) {
            this.generateRandomToken();
        }
    }

    public generateRandomToken(): string {
        this.token = RandomTokenService.make();

        return this.token;
    }

    public toPublicJSON(): PublicUserSchemaType {
        if (!this.id) {
            throw Error("needs id");
        }

        return {
            id: this.id,
            name: this.name,
            email: this.email,
        };
    }
    public toJSON(): UserSchemaType {
        if (!this.id) {
            throw Error("needs id");
        }

        return {
            email: this.email,
            id: this.id,
            name: this.name,
            token: this.token,
        };
    }
}
