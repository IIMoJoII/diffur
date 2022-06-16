import React, { useState } from 'react';
import axios from "axios";
import '../App.css';

interface RungeKuttaProps {
    refactorEquation: any,
    setChartData: any,
    type: string
}

export function RungeKutta({ refactorEquation, setChartData, type }: RungeKuttaProps) {
    const [data, setData] = useState({
        equation: '',
        equation2: '',
        from: '',
        to: '',
        step: '',
        y: '',
        yy: ''
    })
    const [secondEquation, setSecondEquation] = useState(false)
    const [loading, setLoading] = useState(false)

    // Отправляем данные на сервер
    const handleSolve = async () => {
        setLoading(true)
        // Запрос на сервер
        const res = await axios({
            method: 'post',
            url: 'http://localhost:5000/solveRungeKutta',
            data: {
                equation: data.equation,
                from: data.from,
                to: data.to,
                step: data.step,
                y: data.y
            }
        });

        setLoading(false)
        // Полученные с сервера данные записываем в график
        setChartData(res.data)
    }

    const handleAdams = async () => {
        setLoading(true)
        const res = await axios({
            method: 'post',
            url: 'http://localhost:5000/solveAdams',
            data: {
                equation: data.equation,
                from: data.from,
                to: data.to,
                step: data.step,
                y: data.y
            }
        });

        setLoading(false)
        // Полученные с сервера данные записываем в график
        setChartData(res.data)
    }

    const handleAdamsSystem = async () => {
        setLoading(true)
        const res = await axios({
            method: 'post',
            url: 'http://localhost:5000/solveAdams',
            data: {
                equation: data.equation,
                equation2: data.equation2,
                from: data.from,
                to: data.to,
                step: data.step,
                y: data.y,
                yy: data.yy
            }
        });

        setLoading(false)
        // Полученные с сервера данные записываем в график
        setChartData(res.data)
    }

    React.useEffect(() => {
        refactorEquation(data)
    }, [data])

    return (
        <div>
            <div className="input">
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", position: "relative"}}>
                    <input
                        onChange={(e) => {
                            setData({...data, equation: e.target.value})
                        }}
                        placeholder='Введите уравнение'
                    />
                    {!secondEquation && type === 'adams' && <button className="plus" onClick={() => setSecondEquation(true)}>+</button>}
                </div>

                {secondEquation && type === 'adams' && <div style={{display: "flex", flexDirection: "row", alignItems: "center", position: "relative"}}>
                    <input
                        onChange={(e) => {
                            setData({...data, equation2: e.target.value})
                        }}
                        placeholder='Введите уравнение'
                    />
                    <button className="plus" onClick={() => setSecondEquation(false)}>-</button>
                </div>}

                <input
                    onChange={(e) => setData({...data, y: e.target.value})}
                    placeholder='y0'
                />
                {secondEquation && type === 'adams' && <input
                    onChange={(e) => setData({...data, yy: e.target.value})}
                    placeholder='x0'
                />}
                <input
                    onChange={(e) => setData({...data, from: e.target.value})}
                    placeholder='От'
                />
                <input
                    onChange={(e) => setData({...data, to: e.target.value})}
                    placeholder='До'
                />
                <input
                    onChange={(e) => setData({...data, step: e.target.value})}
                    placeholder='Шаг'
                />
            </div>
            <div className="buttons">
                <button className='solution' onClick={() => type === 'runge_kutta' ? handleSolve() : secondEquation ? handleAdamsSystem() : handleAdams()} disabled={loading}>{!loading ? 'Решение' : 'Идёт решение...'}</button>
            </div>
        </div>
    )
}