type User = {
    username: string;
    ready?: string;
    progress?: number;
};

type Room = {
    name: string;
    numberOfUsers: number;
    isReady: boolean;
};

type Users = Set<string>;

type RoomsWithUsers = Map<string, Set<User>>;

export type { User, Users, Room, RoomsWithUsers };
