import React, {useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export function MethodChart({chartData}: any) {
    const [arrXs, setArrXs] = React.useState<any>(chartData?.arrXs || null)
    const [arrY, setArrY] = React.useState<any>(chartData?.arrY || null)

    useEffect(() => {
        setArrXs(chartData.arrXs)
        setArrY(chartData.arrY)
    }, [chartData])

    const data = {
        labels: arrXs || [],
        datasets: [
            {
                label: 'X',
                data: arrY || [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
        ],
    };

    return (
        <Line data={data} />
    )
}