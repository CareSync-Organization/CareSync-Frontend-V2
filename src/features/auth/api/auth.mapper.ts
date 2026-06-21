import type { User, UserDto } from "../types/auth.types";

export function mapUserDto(dto: UserDto): User {
    return {
        id: dto.id,
        name: dto.name,
        email: dto.email,
        profilePic: dto.profile_pic,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at
    }
}