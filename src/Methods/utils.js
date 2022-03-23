export const partsCalc = (y, ys, t) => {
    ys[0] = y[1];       // ys[1]-первая производная; ys[2]-вторая и т.д.
    ys[1] = y[2];             // t-независимый аргумент
    ys[2] = 5 + t * t - y[0] - 3. * y[1] - 2. * y[2];

    return {ys0: ys[0], ys1: ys[1], ys2: ys[2]}
}