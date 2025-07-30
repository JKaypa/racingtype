import { Server } from 'socket.io';
import * as config from './config.js';
import { Event } from '~/enums/events.enum.js';
import { MSG } from '~/enums/messages.enum.js';
import { ClientToServerEvents, ServerToClientEvents, User } from '~/types/types.js';
import {
    emptyRooms,
    isRoomReady,
    resetUsers,
    roomsNotReady,
    getRoomsBelowThreeUsers,
    roomsWithThreeUsers,
    timer
} from './helpers/helpers.js';

const usernames = new Set<string>();
const roomUsers = new Map<string, Set<User>>();

export default (io: Server<ClientToServerEvents, ServerToClientEvents>) => {
    io.on('connection', socket => {
        const username = socket.handshake.query.username as string;
        const currentUser: User = { username };
        let currentRoom: string;

        if (usernames.has(username)) return socket.emit(Event.REDIRECT, MSG.USERNAME_EXISTS);

        usernames.add(username);

        const rooms = getRoomsBelowThreeUsers(roomUsers);

        socket.emit(Event.UPDATE_ROOMS, { rooms });
        socket.on(Event.JOIN_ROOM, roomName => {
            const numberOfUsers = roomUsers.get(roomName)?.size;
            const isReady = isRoomReady(roomUsers, roomName);
            const maxUsersForRoom = config.MAXIMUM_USERS_FOR_ONE_ROOM;

            if ((!numberOfUsers || numberOfUsers < maxUsersForRoom) && !isReady) {
                socket.join(roomName);
                currentRoom = roomName;

                roomUsers.has(roomName)
                    ? roomUsers.get(roomName)?.add(currentUser)
                    : roomUsers.set(roomName, new Set([currentUser]));

                const rooms = getRoomsBelowThreeUsers(roomUsers);
                const roomsToRemove = roomsWithThreeUsers(roomUsers);
                const usersJoined = [...(roomUsers.get(roomName) as Set<User>)];

                socket.broadcast.emit(Event.UPDATE_ROOMS, { rooms, roomsToRemove });
                socket.emit(Event.JOIN_DONE, roomName, usersJoined);
                socket.to(roomName).emit(Event.JOIN_DONE, roomName, [{ username }]);
            } else {
                socket.emit(Event.UNAUTHORIZED, MSG.NOT_ALLOWED);
            }
        });

        socket.on(Event.GET_READY, () => {
            const ready = 'ready';
            currentUser.ready = ready;

            io.to(currentRoom).emit(Event.GOT_READY, ready, username);

            timer({ currentUser, io, roomName: currentRoom, roomUsers, socket });
        });

        socket.on(Event.PROGRESSION, progress => {
            currentUser.progress = progress;
            io.to(currentRoom).emit(Event.PROGRESSION, progress, username);
        });

        socket.on(Event.RESTART, () => {
            resetUsers(roomUsers, currentRoom);
            const rooms = getRoomsBelowThreeUsers(roomUsers);
            socket.broadcast.emit(Event.UPDATE_ROOMS, { rooms });
        });

        socket.on(Event.LEAVE_ROOM, () => {
            socket.leave(currentRoom);

            roomUsers.get(currentRoom)?.delete(currentUser);

            const rooms = roomsNotReady(roomUsers);
            const roomsToRemove = emptyRooms(roomUsers);
            !roomUsers.get(currentRoom)?.size && roomUsers.delete(currentRoom);

            socket.broadcast.emit(Event.UPDATE_ROOMS, { rooms, roomsToRemove });
            socket.to(currentRoom).emit(Event.LEAVE_ROOM, username);
        });

        socket.on('disconnect', () => {
            usernames.delete(username);
            roomUsers.get(currentRoom)?.delete(currentUser);
            !roomUsers.get(currentRoom)?.size && roomUsers.delete(currentRoom);

            socket.to(currentRoom).emit(Event.LEAVE_ROOM, username);
        });
    });
};
