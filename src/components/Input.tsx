import React from 'react';
import '../App.css';

interface InputProps {
    onChange: any
    children: any
}

export function Input({ onChange, children }: InputProps) {
    return (
        <div style={{display: "flex", flexDirection: "row", alignItems: "center", position: "relative", width: "100%"}}>
            {children}
            <input
                onChange={(e) => onChange(e)}
                placeholder='Введите уравнение'
                className="Input"
            />
        </div>
    )
}