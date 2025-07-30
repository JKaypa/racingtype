import { Room, RoomsWithUsers } from '~/types/types.js';
import * as config from '~/src/socket/config.js';

const roomsMapper = (roomsUsers: RoomsWithUsers) => {
    const rooms: Room[] = [];
    let isReady = false;

    roomsUsers.forEach((users, name) => {
        if (users.size) {
            const usersInRoom = Array.from(users);
            isReady = usersInRoom.every(user => user.ready === 'ready');
        }

        const room = {
            name,
            numberOfUsers: users.size,
            isReady
        };

        rooms.push(room);
    });

    return rooms;
};

const roomsNotReady = (roomsUsers: RoomsWithUsers) => {
    return roomsMapper(roomsUsers).filter(room => !room.isReady);
};

const isRoomReady = (roomsUsers: RoomsWithUsers, roomName: string) => {
    return roomsMapper(roomsUsers).find(room => room.name === roomName)?.isReady;
};

const getRoomsBelowThreeUsers = (roomsUsers: RoomsWithUsers) => {
    return roomsNotReady(roomsUsers).filter(room => room.numberOfUsers < config.MAXIMUM_USERS_FOR_ONE_ROOM);
};

const roomsWithThreeUsers = (roomsUsers: RoomsWithUsers) => {
    return roomsNotReady(roomsUsers)
        .filter(room => room.numberOfUsers === config.MAXIMUM_USERS_FOR_ONE_ROOM)
        .map(room => room.name);
};

const emptyRooms = (roomsUsers: RoomsWithUsers) => {
    return roomsMapper(roomsUsers)
        .filter(room => !room.numberOfUsers)
        .map(room => room.name);
};

const isRoomEmpty = (roomsUser: RoomsWithUsers, roomName: string) => {
    return !roomsMapper(roomsUser).find(room => room.name === roomName)?.numberOfUsers;
};

export { emptyRooms, isRoomEmpty, isRoomReady, roomsMapper, roomsNotReady, getRoomsBelowThreeUsers, roomsWithThreeUsers };
