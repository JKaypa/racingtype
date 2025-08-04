import { it, describe, beforeEach, TestContext } from 'node:test';
import assert from 'node:assert/strict';
import {
    emptyRooms,
    isRoomEmpty,
    isRoomReady,
    roomsMapper,
    roomsNotReady,
    getRoomsBelowThreeUsers,
    roomsWithThreeUsers
} from '~/src/socket/helpers/rooms-mapper/rooms-mapper.helper.js';
import { User, RoomsWithUsers } from '~/types/users-and-rooms/users-and-rooms.types.js';

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

        it('should map rooms with users correctly', (t: TestContext) => {
            t.plan(3);
            mockRoomsWithUsers.set('room1', new Set([user1, user2]));
            mockRoomsWithUsers.set('room2', new Set([readyUser1, readyUser2, readyUser3]));

            const result = roomsMapper(mockRoomsWithUsers);

            t.assert.strictEqual(result.length, 2);

            t.assert.deepStrictEqual(result[0], {
                name: 'room1',
                numberOfUsers: 2,
                isReady: false
            });
            t.assert.deepStrictEqual(result[1], {
                name: 'room2',
                numberOfUsers: 3,
                isReady: true
            });
        });

        it('should handle empty room correctly', (t: TestContext) => {
            t.plan(2);
            mockRoomsWithUsers.set('emptyRoom', new Set());

            const result = roomsMapper(mockRoomsWithUsers);

            t.assert.strictEqual(result.length, 1);
            t.assert.deepStrictEqual(result[0], {
                name: 'emptyRoom',
                numberOfUsers: 0,
                isReady: false
            });
        });
    });

    describe('roomsNotReady', () => {
        it('should return only rooms that are not ready', (t: TestContext) => {
            t.plan(3);
            mockRoomsWithUsers.set('notReadyRoom', new Set([user1, user2]));
            mockRoomsWithUsers.set('readyRoom', new Set([readyUser1, readyUser2]));

            const result = roomsNotReady(mockRoomsWithUsers);

            t.assert.strictEqual(result.length, 1);
            t.assert.strictEqual(result[0].name, 'notReadyRoom');
            t.assert.strictEqual(result[0].isReady, false);
        });

        it('should return empty array when all rooms are ready', (t: TestContext) => {
            mockRoomsWithUsers.set('readyRoom1', new Set([readyUser1]));
            mockRoomsWithUsers.set('readyRoom2', new Set([readyUser2, readyUser3]));

            const result = roomsNotReady(mockRoomsWithUsers);

            t.assert.deepStrictEqual(result, []);
        });
    });

    describe('isRoomReady', () => {
        it('should return true for ready room', (t: TestContext) => {
            mockRoomsWithUsers.set('readyRoom', new Set([readyUser1, readyUser2]));

            const result = isRoomReady(mockRoomsWithUsers, 'readyRoom');

            t.assert.strictEqual(result, true);
        });

        it('should return false for not ready room', (t: TestContext) => {
            mockRoomsWithUsers.set('notReadyRoom', new Set([user1, user2]));

            const result = isRoomReady(mockRoomsWithUsers, 'notReadyRoom');

            t.assert.strictEqual(result, false);
        });

        it('should return undefined for non-existent room', (t: TestContext) => {
            const result = isRoomReady(mockRoomsWithUsers, 'nonExistentRoom');

            t.assert.ok(!result);
        });
    });

    describe('getRoomsBelowThreeUsers', () => {
        it('should return rooms with less than 3 users that are not ready', (t: TestContext) => {
            t.plan(5);

            mockRoomsWithUsers.set('room1', new Set([user1])); // 1 user, not ready
            mockRoomsWithUsers.set('room2', new Set([user1, user2])); // 2 users, not ready
            mockRoomsWithUsers.set('room3', new Set([user1, user2, user3])); // 3 users, not ready
            mockRoomsWithUsers.set('readyRoom', new Set([readyUser1])); // 1 user, ready

            const result = getRoomsBelowThreeUsers(mockRoomsWithUsers);

            t.assert.strictEqual(result.length, 2);
            t.assert.ok(result.map(room => room.name).includes('room1'));
            t.assert.ok(result.map(room => room.name).includes('room2'));
            t.assert.ok(!result.map(room => room.name).includes('room3'));
            t.assert.ok(!result.map(room => room.name).includes('readyRoom'));
        });
    });

    describe('roomsWithThreeUsers', () => {
        it('should return names of rooms with exactly 3 users that are not ready', (t: TestContext) => {
            t.plan(4);

            mockRoomsWithUsers.set('room1', new Set([user1, user2])); // 2 users
            mockRoomsWithUsers.set('room2', new Set([user1, user2, user3])); // 3 users, not ready
            mockRoomsWithUsers.set('readyRoom', new Set([readyUser1, readyUser2, readyUser3])); // 3 users, ready

            const result = roomsWithThreeUsers(mockRoomsWithUsers);

            t.assert.strictEqual(result.length, 1);
            t.assert.ok(result.includes('room2'));
            t.assert.ok(!result.includes('room1'));
            t.assert.ok(!result.includes('readyRoom'));
        });
    });

    describe('emptyRooms', () => {
        it('should return names of empty rooms', (t: TestContext) => {
            t.plan(4);

            mockRoomsWithUsers.set('emptyRoom1', new Set());
            mockRoomsWithUsers.set('emptyRoom2', new Set());
            mockRoomsWithUsers.set('nonEmptyRoom', new Set([user1]));

            const result = emptyRooms(mockRoomsWithUsers);

            t.assert.strictEqual(result.length, 2);
            t.assert.ok(result.includes('emptyRoom1'));
            t.assert.ok(result.includes('emptyRoom2'));
            t.assert.ok(!result.includes('nonEmptyRoom'));
        });

        it('should return empty array when no rooms are empty', (t: TestContext) => {
            mockRoomsWithUsers.set('room1', new Set([user1]));
            mockRoomsWithUsers.set('room2', new Set([user2, user3]));

            const result = emptyRooms(mockRoomsWithUsers);

            t.assert.deepStrictEqual(result, []);
        });
    });

    describe('isRoomEmpty', () => {
        it('should return true for empty room', (t: TestContext) => {
            mockRoomsWithUsers.set('emptyRoom', new Set());

            const result = isRoomEmpty(mockRoomsWithUsers, 'emptyRoom');

            t.assert.strictEqual(result, true);
        });

        it('should return false for non-empty room', (t: TestContext) => {
            mockRoomsWithUsers.set('nonEmptyRoom', new Set([user1]));

            const result = isRoomEmpty(mockRoomsWithUsers, 'nonEmptyRoom');

            t.assert.strictEqual(result, false);
        });

        it('should return true for non-existent room', (t: TestContext) => {
            const result = isRoomEmpty(mockRoomsWithUsers, 'nonExistentRoom');

            t.assert.strictEqual(result, true);
        });
    });
});
