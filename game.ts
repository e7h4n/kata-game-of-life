import { readFile } from 'fs/promises';

export function neighbors(matrix: number[][]): number[][] {
    const result: number[][] = [];
    for (let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            result[i] = result[i] || [];
            result[i][j] = result[i][j] || 0;
            if (!matrix[i][j]) {
                continue;
            }

            for (let n = Math.max(i - 1, 0); n < Math.min(i + 2, matrix.length); n++) {
                for (let m = Math.max(j - 1, 0); m < Math.min(j + 2, matrix[i].length); m++) {
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

export function nextGeneration(matrix: number[][]) {
    const neighborsMatrix = neighbors(matrix);

    for (let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            matrix[i][j] = isAlive(matrix[i][j], neighborsMatrix[i][j]);
        }
    }
}

export function isAlive(alive: number, neighbors: number): number {
    if (alive && (neighbors < 2 || neighbors > 3)) {
        return 0;
    }

    if (!alive && neighbors === 3) {
        return 1;
    }

    return alive;
}

export async function loadFile(filePath: string): Promise<number[][]> {
    const input = await readFile(filePath, 'utf-8');
    const matrix: number[][] = [];
    let i = 0;
    let j = 0;
    let cols = 0;
    for (let n = 0; n < input.length; n++) {
        if (input[n] === '\n') {
            i += 1;
            j = 0;
            continue;
        }
        matrix[i] = matrix[i] || [];
        matrix[i][j] = input[n] === '*' ? 1 : 0;
        j += 1;
        cols = Math.max(j, cols);
    }

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < cols; j++) {
            matrix[i][j] = matrix[i][j] || 0;
        }
    }

    return matrix;
}

export function printMatrix(matrix: number[][]) {
    let result = '';
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            result += matrix[i][j] === 1 ? '*' : '.';
        }
        if (i !== matrix.length - 1) {
            result += '\n';
        }
    }
    console.log(result);
}

export async function main(argv: string[]) {
    const filePath = argv[2];
    const matrix = await loadFile(filePath);

    nextGeneration(matrix);
    printMatrix(matrix);
}

if (typeof require !== 'undefined' && require.main === module) {
    main(process.argv);
}
