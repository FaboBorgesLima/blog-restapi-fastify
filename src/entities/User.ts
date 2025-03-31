import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { RandomTokenService } from "../services/RandomTokenService";

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
}
