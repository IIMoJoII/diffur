import React from 'react';
import MJ from 'react-mathjax-ts'
import './App.css';
import axios from "axios";
import { MethodChart } from "./components/MethodChart";

interface FormulaProps {
    equation: string
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
                    <MJ.Text text={`$$ ${equation} $$`}/>
                </div>
            </MJ.Context>
        </div>
    )
};

function App() {
    const [drop, setDrop] = React.useState<boolean>(false)
    const [chosenType, setChosenType] = React.useState<any>(null)
    const [info, setInfo] = React.useState<boolean>(false)
    const [equation, setEquation] = React.useState<string>('')
    const [examples, setExamples] = React.useState<boolean>(false)
    const [chartData, setChartData] = React.useState<any>(null)

    const handleDrop = () => {
        setDrop(!drop)
    }

    const setType = (type: any) => {
        setChosenType(type)
        handleDrop()
    }

    const refactorEquation = (value: string) => {
        setEquation(value)
    }

    const types = [
        {name: 'Метод Адамса', id: 'adams'},
        {name: 'Альфа-устойчивый метод Рунге-Кутта', id: 'runge_kutta'},
    ]

    const examplesArr = [
        {name: 'Сумма', id: 'sum'},
        {name: 'Интеграл', id: 'int'},
        {name: 'Корень', id: 'sqrt'},
        {name: 'Степень', id: 'pow'},
        {name: 'Предел', id: 'lim'},
    ]

    const handleInfo = () => {
        setInfo(!info)
        setExamples(false)
    }

    const handleExamples = () => {
        setExamples(!examples)
        setInfo(false)
    }

    let args = {
        y: [1., 0.1, 0.],
        xs: .0,
        xe: .1,
        n: 3
    }

    const handleSolve = async () => {
        const res = await axios({
            method: 'post',
            url: 'http://localhost:5000/solveAdams',
            data: args
        });

        console.log(res.data)
        setChartData(res.data)
    }

  return (
    <div className="wrapper">
      <div className="main">
          <div className="left">
              <div className="header">
                  <h1>Дифференциальные уравнения</h1>
                  <h2>(общее решение уравнения)</h2>
              </div>
              <div className="input">
                  <input
                      onChange={(e) => refactorEquation(e.target.value)}
                      placeholder='Введите уравнение'
                  />
                  <div className='solve'>
                      <input
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
              <div className="buttons">
                  <button className='solution' onClick={handleSolve}>Решение</button>
                  <button onClick={handleInfo} className='info'>Справка</button>
                  <button onClick={handleExamples} className='info'>Примеры</button>
              </div>
              {examples && <div className='examples'>
                  <ul>
                      {examplesArr && examplesArr.map(example =>
                        <li key={example.id}>{example.name}</li>
                      )}
                  </ul>
              </div>}
              {info && <div className='infoWrapper'>
                  <h2>Справка</h2>

                  <ul>
                      <li>Греческие буквы -
                          <span>"alpha - &#945;", "beta - &#946;", "omega - &#969;"</span>
                      </li>
                      <li>Заглавные греческие буквы - <span>"Gamma - &#915;", "Delta - &#916;", "Omega - &#937;"</span></li>
                      <li>Некоторые варианты для греческих букв - <span>"epsilon - &#949;", "phi - &#934;", "varphi - &#966;"</span></li>
                      <li>Надстрочные и подстрочные индексы - <span>^ и _</span></li>
                      <li>Группирование - <span>{}</span></li>
                      <li>Обозначения - <span>infty - бесконечность</span></li>
                      <li>Корни - <span>sqrt, sqrt[3]</span></li>
                      <li>Скобки - <span>|x|, ||x||, (x), langle x rangle, ceil(x), floor(x), [x]</span></li>
                      <li>Суммы и интегралы - <span>sum_1^k, sum_(i=0)^\infty i^2, prod, int, bigcup, bigcap</span></li>
                      <li>Специальные функции - <span>lim_(x\to 0), lim, sinx, max, ln</span></li>
                      <li>Специальные символы - <span>lt, gt, le, leq, ge, geq, ne</span></li>
                  </ul>
              </div>}
          </div>
          <div className="right">
              <h1>Решение</h1>
              <div className="point">
                  <span>Начальная запись</span>
                  <div className='equation'>
                      <Formula equation={equation}/>
                  </div>
              </div>
              {chartData && <MethodChart chartData={chartData} />}
          </div>
      </div>
    </div>
  );
}

export default App;
