const normalizeToCanvas = (canvas, array_2d, extractNested = false) => {
    if(extractNested) {
        array_2d = array_2d.reduce((acc, curr) => [
                [...acc[0], curr[0]],
                [...acc[1], curr[1]]
            ], [[],[]]);
    }
    const { width, height } = canvas;
    const [xArray, yArray] = array_2d;


    const xMax = Math.max(...xArray);
    const yMax = Math.max(...yArray);

    const xMin = Math.min(...xArray);
    const yMin = Math.min(...yArray);

    const xNormals = normalize(xMax, xMin, xArray, width);
    const yNormals = normalize(yMax, yMin, yArray, height);

    let result = [xNormals, yNormals];
    const actualResult = [];
    for(let i = 0; i < result[0].length; ++i) {
        actualResult[i] = [result[0][i], result[1][i]];
    }
    result = actualResult;
    return result;
}

const normalize = (max, min, arr, scale = 1) => arr.map(n => ((n - min) / (max - min)) * scale);

export { normalizeToCanvas  };