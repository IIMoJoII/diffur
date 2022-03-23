import { partsCalc } from "./utils";

export default class RungeKuttaMethod {
    constructor() {
        this.k1 = null;
        this.k2 = null;
        this.k3 = null;
        this.k4 = null // Для метода Рунге-Кутта
    }

    freeMemory() {
        this.k1 = null
    }

    allocateMemory(n) {
        this.k1 = new Array((4 + 4 + 4 + 1) * n)
        this.k2 = this.k1 + n;
        this.k3 = this.k2 + n;
        this.k4 = this.k3 + n;
    }

    solution(y, y0, ya, q0, xi, h, n) {
        console.log(123, y, y0, ya, q0, xi, h, n)
        for (let j = 0; j < n; j++)
            y0[j] = y[j];

        partsCalc(y0, q0, xi)

        for (let j = 0; j < n; j++) // Делаем q0
            q0[j] *= h;

        xi += h;

        for (let i = 0; i < 3; i++) { // i - КАКОЕ ЗНАЧЕНИЕ УЖЕ ЕСТЬ
            let diff
            // А ВЫЧИСЛЯЕМ ЗНАЧЕНИЯ Y[i+1]!!!!
            diff = partsCalc(y0[i * n], this.k1, xi)  // Вычислим partsCalc(xi, yi) = k1 / h
            this.k1[0] = diff.ys0
            this.k1[1] = diff.ys1
            this.k1[2] = diff.ys2

            // вычисления k2
            for (let j = 0; j < n; j++) {
                this.k1[j] *= h;
                ya[j] = y0[i * n + j] + this.k1[j] / 2; // Вычислим наконец-то k1
                // И один из аргументов для функции
            }

            // вычисления k2
            diff = partsCalc(ya, this.k2, xi + (h / 2))  // Вычислим partsCalc(xi, yi) = k2 / h
            this.k2[0] = diff.ys0
            this.k2[1] = diff.ys1
            this.k2[2] = diff.ys2

            for (let j = 0; j < n; j++) {
                this.k2[j] *= h;
                ya[j] = y0[i * n + j] + this.k2[j] / 2; // И один из аргументов для функции
            }

            // вычисления k3
            diff = partsCalc(ya, this.k3, xi + (h / 2))  // Вычислим partsCalc(xi, yi) = k3 / h
            this.k3[0] = diff.ys0
            this.k3[1] = diff.ys1
            this.k3[2] = diff.ys2

            for (let j = 0; j < n; j++) {
                this.k3[j] *= h;                 // Вычислим наконец-то k3
                ya[j] = y0[i * n + j] + this.k3[j];  // И один из аргументов для функции
            }

            // вычисления k4
            diff = partsCalc(ya, this.k4, xi + h)  // Вычислим partsCalc(xi, yi) = k4 / h
            this.k4[0] = diff.ys0
            this.k4[1] = diff.ys1
            this.k4[2] = diff.ys2

            for (let j = 0; j < n; j++) // Вычислим наконец-то k4
                this.k4[j] *= h;

            // Надо вычислить приращение каждой функции из n
            for (let j = 0; j < n; j++) // Вычисляем следующее значение
                y0[(i + 1) * n + j] = y0[i * n + j] + (this.k1[j] + 2 * this.k2[j] + 2 * this.k3[j] + this.k4[j]) / 6; // функции Y[i+1] = Yi + ...

            diff = partsCalc(y0[(i + 1) * n], q0[(i + 1) * n], xi); // qi = f (xi, yi);
            q0[0] = diff.ys0
            q0[1] = diff.ys1
            q0[2] = diff.ys2


            for (let j = 0; j < n; j++)
                q0[((i + 1) * n) + j] *= h;

            xi += h;
        }

        return { y, y0, ya, q0, xi, h, n }
    }
}