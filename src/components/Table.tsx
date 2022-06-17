import React from 'react';
import '../App.css';

interface TableProps {
  chartData: any
}

export function Table({ chartData }: TableProps) {
    return (
        <>
            {chartData && <table className="table">
                <thead>
                <tr>
                    <th scope="col">x</th>
                    <th scope="col">y</th>
                </tr>
                </thead>
                <tbody>
                {chartData?.arrXs?.map((x: number, index: number) =>
                    <tr key={index}>
                        <td>{x}</td>
                        <td>{(chartData && chartData?.arrY && chartData?.arrY[index]) && chartData?.arrY[index]}</td>
                    </tr>
                )}
                </tbody>
            </table>}
        </>
    )
}