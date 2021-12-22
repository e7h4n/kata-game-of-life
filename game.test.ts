function neighbors(matrix: number[][], rows: number, cols: number) {
    const result = [];
    for (let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            result[i] = result[i] || [];
            result[i][j] = result[i][j] || 0;
            if (!matrix[i][j]) {
                continue;
            }

            for (let n = Math.max(i - 1, 0); n < Math.min(i + 2, rows); n++) {
                for (let m = Math.max(j - 1, 0); m < Math.min(j + 2, cols); m++) {
                    if (n !== i || m !== j) {
                        result[n] = result[n] || [];
                        result[n][m] = (result[n][m] || 0) + 1;
                    }
                }
            }
        }
    }

    return result;
}

function nextGeneration(matrix: number[][], rows: number, cols: number) {
    const neighborsMatrix = neighbors(matrix, rows, cols);

    for (let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            matrix[i][j] = isAlive(matrix[i][j], neighborsMatrix[i][j]);
        }
    }
}

function isAlive(alive: number, neighbors: number) {
    if (alive && (neighbors < 2 || neighbors > 3)) {
        return 0;
    }

    if (!alive && neighbors === 3) {
        return 1;
    }

    return alive;
}

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
