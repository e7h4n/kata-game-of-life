import { main, neighbors, isAlive, nextGeneration } from './game';
import { readFile } from 'fs/promises';

describe('neighbors', () => {
    [
        [
            [
                [1],
            ],
            [
                [0],
            ],
        ],
        [
            [
                [1, 0],
            ],
            [
                [0, 1],
            ],
        ],
        [
            [
                [1],
                [0],
            ],
            [
                [0],
                [1],
            ],
        ],
        [
            [
                [0, 1, 0],
            ],
            [
                [1, 0, 1],
            ],
        ],
        [
            [
                [0, 1, 0],
                [0, 0, 0],
                [0, 0, 0],
            ],
            [
                [1, 0, 1],
                [1, 1, 1],
                [0, 0, 0],
            ],
        ],
        [
            [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 1],
            ],
            [
                [0, 0, 0],
                [0, 1, 1],
                [0, 1, 0],
            ],
        ],
        [
            [
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0],
            ],
            [
                [1, 1, 1],
                [1, 0, 1],
                [1, 1, 1],
            ],
        ],
        [
            [
                [1, 1, 1],
                [1, 0, 1],
                [1, 1, 1],
            ],
            [
                [2, 4, 2],
                [4, 8, 4],
                [2, 4, 2],
            ],
        ],
    ].forEach(([gameMatrix, neighborsMatrix]) => {
        test(`should generate neighbors count matrix : ${JSON.stringify(gameMatrix)}`, () => {
            const matrix = neighbors(gameMatrix, gameMatrix.length, gameMatrix[0].length);
            expect(matrix).toMatchObject(neighborsMatrix);
        });
    });
});

describe('isAlive', () => {
    [0, 1, 4, 5, 6, 7, 8].forEach(i => {
        test(`should make cell dead if it has ${i} neighbors`, () => {
            const alive = isAlive(1, i);
            expect(alive).toBe(0);
        });
    });

    [2, 3].forEach(i => {
        test(`should make cell keep alive if it has ${i} neighbors`, () => {
            const alive = isAlive(1, i);
            expect(alive).toBe(1);
        });
    });

    [0, 1, 2, 4, 5, 6, 7, 8].forEach(i => {
        test(`should make cell keep dead if it has ${i} neighbors`, () => {
            const alive = isAlive(0, i);
            expect(alive).toBe(0);
        });
    });

    [3].forEach(i => {
        test(`should make cell alive if it has ${i} neighbors`, () => {
            const alive = isAlive(0, i);
            expect(alive).toBe(1);
        });
    });
});

describe('nextGeneration', () => {
    test('should make corner cell dead when it in corner and has no neighbors', () => {
        const gameMatrix = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ];
        nextGeneration(gameMatrix, 4, 8);
        expect(gameMatrix).toMatchObject([
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
        ]);
    });
});

describe('main', () => {
    const _log = console.log;
    const logMock = jest.fn();
    beforeEach(() => {
        console.log = logMock;
    });

    afterEach(() => {
        logMock.mockClear();
        console.log = _log;
    });

    test('should take a file parameter than output next generation', async () => {
        await main(['node', 'game.ts', 'fixtures/use_case1_input.txt']);

        const output = await readFile('fixtures/use_case1_output.txt', 'utf-8');
        expect(logMock.mock.calls).toHaveLength(1);
    });
});
