import RungeKuttaMethod from "./RungeKuttaMethod";
import { partsCalc } from "./utils";

export default class AdamsMethod {
    constructor(
                y, // Массив размера n значений зависимых переменных
                n, // Массив размера n значений производных
                tn, // Начало интервала интегрирования
                tk, // Конец интервала интегрирования
                m, // Начальное число разбиений отрезка интегрирования
                eps // Относительная погрешность интегрирования
    ) {
        this.y = y
        this.n = n
        this.tn = tn
        this.tk = tk
        this.m = m
        this.eps = eps

        this.y0 = null; this.y1 = null; this.y2 = null; this.y3 = null // Значения функции для метода Адамса
        this.ya = null // Временный массив
        this.q0 = null; this.q1 = null; this.q2 = null; this.q3 = null // Значение производных Для метода Адамса
        this.h = null // Шаг интегрирования
        this.xi = null // Текущее значение независимой переменной
        this.rungeKutta = new RungeKuttaMethod()
    }

    allocateMemory() {
        this.rungeKutta.allocateMemory(this.n)

        let k4 = this.rungeKutta.k4

        this.y0 = k4 + this.n;
        this.y1 = this.y0 + this.n;
        this.y2 = this.y1 + this.n;
        this.y3 = this.y2 + this.n;

        this.ya = this.y3 + this.n;

        this.q0 = this.ya + this.n;
        this.q1 = this.q0 + this.n;
        this.q2 = this.q1 + this.n;
        this.q3 = this.q2 + this.n;

        this.h = (this.tk - this.tn) / this.m;  // Шаг
        this.eps = Math.abs(this.eps);       // Абсолютное значение погрешности

        this.eps2 = null;            // Для оценки погрешности
        this.dq2 = null; this.dq1 = null; this.dq0 = null; this.d2q1 = null; this.d2q0 = null; this.d3q0 = null; // приращения

        this.flag = 0;
    }

    calcIncrements() {
        for (let j = 0; j < this.n; j++) {
            // Все приращения
            this.dq2 = this.q3[j] - this.q2[j];
            this.dq1 = this.q2[j] - this.q1[j];
            this.dq0 = this.q1[j] - this.q0[j];
            this.d2q1 = this.dq2 - this.dq1;
            this.d2q0 = this.dq1 - this.dq0;
            this.d3q0 = this.d2q1 - this.d2q0;

            // новое значение функции (в ya пока что)
            this.ya[j] = this.y3[j] + (this.q3[j] + (this.dq2 / 2) + (5 * this.d2q1 / 12) + (3 * this.d3q0 / 8));

            // Сдвигаем все массивы на 1 вперёд и добавляем в очередь новое
            // значение функции
            this.y0[j] = this.y1[j];
            this.y1[j] = this.y2[j];
            this.y2[j] = this.y3[j];
            this.y3[j] = this.ya[j];

            // Просто сдвигаем q, ничего пока что не добавляя
            this.q0[j] = this.q1[j];
            this.q1[j] = this.q2[j];
            this.q2[j] = this.q3[j];
        }

        partsCalc(this.y3, this.q3, this.xi)  // q3 = f (xi, y3);

        for (let j = 0; j < this.n; j++) // Вычислить q3
            this.q3[j] *= this.h;

        this.xi += this.h;
    }

    adamsSolution() {
        this.calcIncrements()

        let j = 0

        // Продолжить интегрирование?
        this.xi < this.tk && this.calcIncrements() // Да.

        // Если первый раз здесь, то просчитать ещё раз с шагом h/2
        if (this.flag === 0)
            this.flag = 1; // Сравнивать уже будет с чем
        else {
            // Не первый раз - оценить погрешность
            // Сейчас в y3 - значение только что вычисленной функции ,
            // а в y2 - занчение функции, вычисленной с шагом h * 2
            // по отношению к текущему
            for (j = 0; j < this.n; j++) {
                this.eps2 = Math.abs(((this.y3[j] - this.y2[j]) / this.y2[j]));
                if (this.eps2 > this.eps) break;  // Если погрешность слишком великА
            }

            if (j === this.n) { // Если всё ОК
                for (j = 0; j < this.n; j++) // Копируем результат
                    this.y[j] = this.y3[j];

                this.rungeKutta.freeMemory() // Освобождаем память

                return
            }
        }

        // По каким-то причинам выхода из функции не произошло -
        // тогда уменьшаем шаг в 2 раза и повторяем
        // всё, начиная с метода Рунге-Кутта

        this.h /= 2;
        this.rungeKutta.solution()
    }

    solution() {
        this.m < 4 && (this.m = 4)  // Минимум 4 отрезка

        if (this.tn >= this.tk) {
            console.log("Неправильные аргументы")
            return
        }

        this.allocateMemory()

        this.xi = this.tn;

        // Вычисляем значения функции y0...y3, т.е. y[i-3] ... y[0]
        // Первое значение системы уравнений уже дано: y ...
        // - Метод Рунге-Кутта 4 порядка -
        let {y, y0, ya, q0, xi, h, n} = this.rungeKutta.solution(this.y, this.y0, this.ya, this.q0, this.xi, this.h, this.n)

        this.y = y
        this.y0 = y0
        this.ya = ya
        this.q0 = q0
        this.xi = xi
        this.h = h
        this.n = n


        // - Метод Адамса -
        // Итак, вычислены 4 первых значения. Этого достаточно для начала метода
        // Адамса для шага h.
        // B y0...y3 лежат 4 значения функций (_НЕ_ПРОИЗВОДНЫХ!!!).
        // A в q0...q3 лежат значения _производных_ этих функций, умноженных на h
        // q0..q3, а также y0..y3 представляют собой очереди с 4 элементами

        this.adamsSolution()
    }

    print() {
        console.log(this.y, this.n, this.tn, this.tk, this.m, this.eps)
    }
}