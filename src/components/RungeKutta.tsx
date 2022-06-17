import React, { useState } from 'react';
import axios from "axios";
import '../App.css';
import {Input} from "./Input";

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
                    <Input onChange={(e: any) => setData({...data, equation: e.target.value})}>
                        <label className="label">
                            y<sub>1</sub>' =
                        </label>
                    </Input>
                    {!secondEquation && type === 'adams' && <button className="plus" onClick={() => setSecondEquation(true)}>+</button>}
                </div>

                {secondEquation && type === 'adams' &&
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center", position: "relative"}}>
                        <Input onChange={(e: any) => setData({...data, equation2: e.target.value})}>
                            <label className="label">
                                y<sub>2</sub>' =
                            </label>
                        </Input>
                        <button className="plus" onClick={() => setSecondEquation(false)}>-</button>
                    </div>
                }

                <Input onChange={(e: any) => setData({...data, y: e.target.value})}>
                    <label className="label">
                        y(0) =
                    </label>
                </Input>
                {secondEquation && type === 'adams' &&
                    <Input onChange={(e: any) => setData({...data, yy: e.target.value})}>
                        <label className="label">
                            x(0) =
                        </label>
                    </Input>
                }
                <Input onChange={(e: any) => setData({...data, from: e.target.value})}>
                    <label className="label">
                        от:
                    </label>
                </Input>
                <Input onChange={(e: any) => setData({...data, to: e.target.value})}>
                    <label className="label">
                        до:
                    </label>
                </Input>
                <Input onChange={(e: any) => setData({...data, step: e.target.value})}>
                    <label className="label">
                        шаг:
                    </label>
                </Input>
            </div>
            <div className="buttons">
                <button
                    className='solution'
                    onClick={() => type === 'runge_kutta' ? handleSolve() : secondEquation ? handleAdamsSystem() : handleAdams()}
                    disabled={loading}>
                    {!loading ? 'Решение' : 'Идёт решение...'}
                </button>
            </div>
        </div>
    )
}