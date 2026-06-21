export type UserDto = {
    id: string;
    name: string;
    email: string;
    profile_pic: string | null;
    created_at: string;
    updated_at: string;
};

export type User = {
    id: string;
    name: string;
    email: string;
    profilePic: string | null;
    createdAt: string;
    updatedAt: string;
};

export type SignupInput = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

export type SigninInput = {
    email: string;
    password: string;
}