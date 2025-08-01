import { it, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import {
    emptyRooms,
    isRoomEmpty,
    isRoomReady,
    roomsMapper,
    roomsNotReady,
    getRoomsBelowThreeUsers,
    roomsWithThreeUsers
} from '~/src/socket/helpers/rooms-mapper/rooms-mapper.helper.js';
import { User, RoomsWithUsers } from '~/types/users-and-rooms/users-and-rooms.types';

describe('Rooms Mapper Helper Functions', () => {
    let mockRoomsWithUsers: RoomsWithUsers;
    let user1: User;
    let user2: User;
    let user3: User;
    let readyUser1: User;
    let readyUser2: User;
    let readyUser3: User;

    beforeEach(() => {
        // Create mock users
        user1 = { username: 'user1' };
        user2 = { username: 'user2' };
        user3 = { username: 'user3' };
        readyUser1 = { username: 'readyUser1', ready: 'ready' };
        readyUser2 = { username: 'readyUser2', ready: 'ready' };
        readyUser3 = { username: 'readyUser3', ready: 'ready' };

        // Create mock rooms with users
        mockRoomsWithUsers = new Map();
    });

    describe('roomsMapper', () => {
        it('should return empty array for empty rooms map', () => {
            const result = roomsMapper(mockRoomsWithUsers);
            assert.deepEqual(result, []);
        });

        it('should map rooms with users correctly', () => {
            mockRoomsWithUsers.set('room1', new Set([user1, user2]));
            mockRoomsWithUsers.set('room2', new Set([readyUser1, readyUser2, readyUser3]));

            const result = roomsMapper(mockRoomsWithUsers);

            assert.strictEqual(result.length, 2);

            assert.deepStrictEqual(result[0], {
                name: 'room1',
                numberOfUsers: 2,
                isReady: false
            });
            assert.deepStrictEqual(result[1], {
                name: 'room2',
                numberOfUsers: 3,
                isReady: true
            });
        });

        it('should handle empty room correctly', () => {
            mockRoomsWithUsers.set('emptyRoom', new Set());

            const result = roomsMapper(mockRoomsWithUsers);

            assert.strictEqual(result.length, 1);
            assert.deepStrictEqual(result[0], {
                name: 'emptyRoom',
                numberOfUsers: 0,
                isReady: false
            });
        });
    });

    describe('roomsNotReady', () => {
        it('should return only rooms that are not ready', () => {
            mockRoomsWithUsers.set('notReadyRoom', new Set([user1, user2]));
            mockRoomsWithUsers.set('readyRoom', new Set([readyUser1, readyUser2]));

            const result = roomsNotReady(mockRoomsWithUsers);

            assert.strictEqual(result.length, 1);
            assert.strictEqual(result[0].name, 'notReadyRoom');
            assert.strictEqual(result[0].isReady, false);
        });

        it('should return empty array when all rooms are ready', () => {
            mockRoomsWithUsers.set('readyRoom1', new Set([readyUser1]));
            mockRoomsWithUsers.set('readyRoom2', new Set([readyUser2, readyUser3]));

            const result = roomsNotReady(mockRoomsWithUsers);

            expect(result).toEqual([]);
        });
    });

    describe('isRoomReady', () => {
        it('should return true for ready room', () => {
            mockRoomsWithUsers.set('readyRoom', new Set([readyUser1, readyUser2]));

            const result = isRoomReady(mockRoomsWithUsers, 'readyRoom');

            expect(result).toBe(true);
        });

        it('should return false for not ready room', () => {
            mockRoomsWithUsers.set('notReadyRoom', new Set([user1, user2]));

            const result = isRoomReady(mockRoomsWithUsers, 'notReadyRoom');

            expect(result).toBe(false);
        });

        it('should return undefined for non-existent room', () => {
            const result = isRoomReady(mockRoomsWithUsers, 'nonExistentRoom');

            expect(result).toBeUndefined();
        });
    });

    describe('getRoomsBelowThreeUsers', () => {
        it('should return rooms with less than 3 users that are not ready', () => {
            mockRoomsWithUsers.set('room1', new Set([user1])); // 1 user, not ready
            mockRoomsWithUsers.set('room2', new Set([user1, user2])); // 2 users, not ready
            mockRoomsWithUsers.set('room3', new Set([user1, user2, user3])); // 3 users, not ready
            mockRoomsWithUsers.set('readyRoom', new Set([readyUser1])); // 1 user, ready

            const result = getRoomsBelowThreeUsers(mockRoomsWithUsers);

            expect(result).toHaveLength(2);
            expect(result.map(room => room.name)).toContain('room1');
            expect(result.map(room => room.name)).toContain('room2');
            expect(result.map(room => room.name)).not.toContain('room3');
            expect(result.map(room => room.name)).not.toContain('readyRoom');
        });
    });

    describe('roomsWithThreeUsers', () => {
        it('should return names of rooms with exactly 3 users that are not ready', () => {
            mockRoomsWithUsers.set('room1', new Set([user1, user2])); // 2 users
            mockRoomsWithUsers.set('room2', new Set([user1, user2, user3])); // 3 users, not ready
            mockRoomsWithUsers.set('readyRoom', new Set([readyUser1, readyUser2, readyUser3])); // 3 users, ready

            const result = roomsWithThreeUsers(mockRoomsWithUsers);

            expect(result).toHaveLength(1);
            expect(result).toContain('room2');
            expect(result).not.toContain('room1');
            expect(result).not.toContain('readyRoom');
        });
    });

    describe('emptyRooms', () => {
        it('should return names of empty rooms', () => {
            mockRoomsWithUsers.set('emptyRoom1', new Set());
            mockRoomsWithUsers.set('emptyRoom2', new Set());
            mockRoomsWithUsers.set('nonEmptyRoom', new Set([user1]));

            const result = emptyRooms(mockRoomsWithUsers);

            expect(result).toHaveLength(2);
            expect(result).toContain('emptyRoom1');
            expect(result).toContain('emptyRoom2');
            expect(result).not.toContain('nonEmptyRoom');
        });

        it('should return empty array when no rooms are empty', () => {
            mockRoomsWithUsers.set('room1', new Set([user1]));
            mockRoomsWithUsers.set('room2', new Set([user2, user3]));

            const result = emptyRooms(mockRoomsWithUsers);

            expect(result).toEqual([]);
        });
    });

    describe('isRoomEmpty', () => {
        it('should return true for empty room', () => {
            mockRoomsWithUsers.set('emptyRoom', new Set());

            const result = isRoomEmpty(mockRoomsWithUsers, 'emptyRoom');

            expect(result).toBe(true);
        });

        it('should return false for non-empty room', () => {
            mockRoomsWithUsers.set('nonEmptyRoom', new Set([user1]));

            const result = isRoomEmpty(mockRoomsWithUsers, 'nonEmptyRoom');

            expect(result).toBe(false);
        });

        it('should return true for non-existent room', () => {
            const result = isRoomEmpty(mockRoomsWithUsers, 'nonExistentRoom');

            expect(result).toBe(true);
        });
    });
});
