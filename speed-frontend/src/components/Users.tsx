export type User = {
    uid?: string;
    email?: string;
    role?: string;
};

export const DefaultEmptyUser: User = {
    uid: undefined, 
    email: '', 
    role: '',
}
