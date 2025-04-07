import dataSource from "../dataSource";
import { User } from "../entities/User";

export const UserRepository = dataSource.getRepository(User);
