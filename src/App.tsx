import React from 'react';
import MJ from 'react-mathjax-ts'
import './App.css';
import { MethodChart } from "./components/MethodChart";
import { RungeKutta } from "./components/RungeKutta";
import { Table } from "./components/Table";

interface FormulaProps {
    equation: any
}


export const Formula: React.FC<FormulaProps> = ({equation}) => {
    return (
        <div>
            <MJ.Context
                input='ascii'
                onLoad={() => console.log('Loaded MathJax script!')}
                onError={(MathJax: any, error: any) => {
                    console.warn(error);
                    console.log('Encountered a MathJax error, re-attempting a typeset!');
                }}
                script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=AM_HTMLorMML"
                options={{
                    asciimath2jax: {
                        useMathMLspacing: true,
                        delimiters: [['$$', '$$']],
                        preview: 'none',
                        messageStyle: 'none'
                    },
                    messageStyle: 'none'
                }}
            >
                <div>
                    <div className="equationWrapper">
                        <div>
                            {equation?.equation && <MJ.Text text={`$$ y_1' = ${equation?.equation || ''} $$`}/>}
                            {equation?.equation2 && <MJ.Text text={`$$ y_2' = ${equation?.equation2 || ''} $$`}/>}
                            {equation?.y && <MJ.Text text={`$$ y_1(0) = ${equation?.y || ''} $$`}/>}
                            {equation?.yy && <MJ.Text text={`$$ y_2(0) = ${equation?.yy || ''} $$`}/>}
                        </div>
                    </div>

                    {(equation?.from || equation?.to) && <MJ.Text text={`$$ x ∈ [${equation?.from || ''}; ${equation?.to || ''}] $$`}/>}
                    {equation?.step && <MJ.Text text={`$$ h = ${equation?.step || ''} $$`}/>}
                </div>
            </MJ.Context>
        </div>
    )
};

function App() {
    const [drop, setDrop] = React.useState<boolean>(false)
    const [chosenType, setChosenType] = React.useState<any>(null)
    const [equation, setEquation] = React.useState<any>(null)
    const [chartData, setChartData] = React.useState<any>(null)

    const handleDrop = () => {
        setDrop(!drop)
    }

    // Устанавливаем тип решаемого уравнения
    const setType = (type: any) => {
        setChosenType(type)
        handleDrop()
    }

    // Сохраняем записанное пользователем уравнение
    const refactorEquation = (value: string) => {
        setEquation(value)
    }

    const types = [
        {name: 'Метод Адамса', id: 'adams'},
        {name: 'Альфа-устойчивый метод Рунге-Кутта', id: 'runge_kutta'},
    ]


  return (
    <div className="wrapper">
      <div className="main">
          <div className="left">
              <div className="header">
                  <h1>Дифференциальные уравнения</h1>
                  <h2>(общее решение уравнения)</h2>
              </div>
              <div className="input">
                  <div className='solve'>
                      <label>Выберите способ решения</label>
                      <input
                          style={{paddingLeft: 20}}
                          onClick={handleDrop}
                          onChange={() => console.log('')}
                          className='solver'
                          placeholder='Способ решения'
                          value={chosenType ? chosenType.name : ""}
                      />
                      {drop &&
                      <ul className='drop'>
                          {types && types.map(type =>
                              <li onClick={() => setType(type)} key={type.id}>{type.name}</li>
                          )}
                      </ul>}
                  </div>
              </div>
              {chosenType?.id &&
                  <RungeKutta
                      refactorEquation={(value: string) => refactorEquation(value)}
                      setChartData={(data: any) => setChartData(data)}
                      type={chosenType?.id}
                  />
              }

          </div>
          <div className="right">
              <h1>Решение</h1>
              <div className="point">
                  <span>Начальная запись</span>
                  <div className='equation'>
                      <Formula equation={equation}/>
                  </div>
              </div>
              {chartData && chartData?.time && <div className="time">Затраченное время: {Number(chartData.time) / 1000} с</div>}
              {chartData && <MethodChart chartData={chartData} />}
              <Table chartData={chartData} />
          </div>
      </div>
    </div>
  );
}

export default App;
