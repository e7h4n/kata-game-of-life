export function neighbors(matrix: number[][], rows: number, cols: number) {
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

export function nextGeneration(matrix: number[][], rows: number, cols: number) {
    const neighborsMatrix = neighbors(matrix, rows, cols);

    for (let i = 0; i < rows; i++) {
        for(let j = 0; j < cols; j++) {
            matrix[i][j] = isAlive(matrix[i][j], neighborsMatrix[i][j]);
        }
    }
}

export function isAlive(alive: number, neighbors: number) {
    if (alive && (neighbors < 2 || neighbors > 3)) {
        return 0;
    }

    if (!alive && neighbors === 3) {
        return 1;
    }

    return alive;
}
