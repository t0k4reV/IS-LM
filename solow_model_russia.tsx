import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ScatterChart, Scatter } from 'recharts';

const SolowModelRussia = () => {
  const [activeTab, setActiveTab] = useState('dynamics');

  // Данные для России 2018-2022
  const data = [
    { year: 2018, actual_k: 2.53, actual_y: 1.51, steady_k: 3.6, steady_y: 1.55, golden_k: 1.64, golden_y: 1.45, savings_rate: 0.161 },
    { year: 2019, actual_k: 2.71, actual_y: 1.53, steady_k: 3.6, steady_y: 1.55, golden_k: 1.64, golden_y: 1.45, savings_rate: 0.171 },
    { year: 2020, actual_k: 2.90, actual_y: 1.46, steady_k: 3.6, steady_y: 1.55, golden_k: 1.64, golden_y: 1.45, savings_rate: 0.166 },
    { year: 2021, actual_k: 3.01, actual_y: 1.52, steady_k: 3.6, steady_y: 1.55, golden_k: 1.64, golden_y: 1.45, savings_rate: 0.185 },
    { year: 2022, actual_k: 3.13, actual_y: 1.56, steady_k: 3.6, steady_y: 1.55, golden_k: 1.64, golden_y: 1.45, savings_rate: 0.201 }
  ];

  // Параметры модели
  const parameters = {
    s: 0.177,      // Средняя норма сбережений
    delta: 0.077,  // Средняя норма амортизации
    n: -0.001,     // Средний темп роста занятости
    alpha: 0.086,  // Эластичность по капиталу
    A: 1.385,      // Совокупная факторная производительность
    k_steady: 3.6, // Устойчивая капиталовооруженность
    y_steady: 1.55, // Устойчивая производительность труда
    k_golden: 1.64, // Золотая капиталовооруженность
    y_golden: 1.45, // Золотая производительность труда
    c_golden: 1.32  // Золотое потребление на душу населения
  };

  // Данные для производственной функции
  const productionFunction = [];
  for (let k = 0.5; k <= 5; k += 0.1) {
    const y = parameters.A * Math.pow(k, parameters.alpha);
    const investment = parameters.s * y;
    const depreciation = (parameters.delta - parameters.n) * k;
    productionFunction.push({
      k: Math.round(k * 100) / 100,
      y: Math.round(y * 1000) / 1000,
      investment: Math.round(investment * 1000) / 1000,
      depreciation: Math.round(depreciation * 1000) / 1000,
      net_investment: Math.round((investment - depreciation) * 1000) / 1000
    });
  }

  const renderDynamics = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Динамика капиталовооруженности и производительности труда</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis label={{ value: 'млн руб./чел.', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value, name) => [value.toFixed(3), name]} />
            <Legend />
            <Line type="monotone" dataKey="actual_k" stroke="#2563eb" strokeWidth={3} name="Фактическая k" />
            <Line type="monotone" dataKey="steady_k" stroke="#dc2626" strokeDasharray="5 5" name="Устойчивая k*" />
            <Line type="monotone" dataKey="golden_k" stroke="#16a34a" strokeDasharray="10 5" name="Золотая k_gold" />
            <Line type="monotone" dataKey="actual_y" stroke="#7c3aed" strokeWidth={3} name="Фактическая y" />
            <Line type="monotone" dataKey="steady_y" stroke="#ea580c" strokeDasharray="5 5" name="Устойчивая y*" />
            <Line type="monotone" dataKey="golden_y" stroke="#059669" strokeDasharray="10 5" name="Золотая y_gold" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Норма сбережений</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis label={{ value: 'Доля', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [value.toFixed(3), 'Норма сбережений']} />
            <Bar dataKey="savings_rate" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderSolowDiagram = () => (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Диаграмма Солоу</h3>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={productionFunction}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="k" 
            label={{ value: 'Капиталовооруженность k (млн руб./чел.)', position: 'insideBottom', offset: -10 }}
          />
          <YAxis label={{ value: 'млн руб./чел.', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            formatter={(value, name) => [value.toFixed(3), name]}
            labelFormatter={(k) => `k = ${k}`}
          />
          <Legend />
          <Line type="monotone" dataKey="y" stroke="#2563eb" strokeWidth={2} name="Производственная функция f(k)" />
          <Line type="monotone" dataKey="investment" stroke="#16a34a" strokeWidth={2} name="Инвестиции sf(k)" />
          <Line type="monotone" dataKey="depreciation" stroke="#dc2626" strokeWidth={2} name="Выбытие (δ+n)k" />
          <Line type="monotone" dataKey="net_investment" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5 5" name="Чистые инвестиции" />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Пересечение линий sf(k) и (δ+n)k показывает устойчивое состояние k* = {parameters.k_steady} млн руб./чел.</strong>
        </p>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">Текущее состояние (2022)</h4>
          <div className="space-y-2 text-sm">
            <p><strong>k:</strong> 3.13 млн руб./чел.</p>
            <p><strong>y:</strong> 1.56 млн руб./чел.</p>
            <p><strong>s:</strong> 20.1%</p>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
          <h4 className="text-lg font-semibold text-red-800 mb-2">Устойчивое состояние</h4>
          <div className="space-y-2 text-sm">
            <p><strong>k*:</strong> {parameters.k_steady} млн руб./чел.</p>
            <p><strong>y*:</strong> {parameters.y_steady} млн руб./чел.</p>
            <p><strong>Отклонение:</strong> -13.1%</p>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
          <h4 className="text-lg font-semibold text-green-800 mb-2">Золотое правило</h4>
          <div className="space-y-2 text-sm">
            <p><strong>k_gold:</strong> {parameters.k_golden} млн руб./чел.</p>
            <p><strong>y_gold:</strong> {parameters.y_golden} млн руб./чел.</p>
            <p><strong>c_gold:</strong> {parameters.c_golden} млн руб./чел.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Ключевые параметры модели</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600">Норма сбережений (s)</p>
            <p className="text-2xl font-bold text-blue-600">{(parameters.s * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Норма амортизации (δ)</p>
            <p className="text-2xl font-bold text-red-600">{(parameters.delta * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Темп роста занятости (n)</p>
            <p className="text-2xl font-bold text-purple-600">{(parameters.n * 100).toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Эластичность по капиталу (α)</p>
            <p className="text-2xl font-bold text-green-600">{parameters.alpha.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">СФП (A)</p>
            <p className="text-2xl font-bold text-orange-600">{parameters.A.toFixed(3)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Эластичность по труду (1-α)</p>
            <p className="text-2xl font-bold text-teal-600">{(1-parameters.alpha).toFixed(3)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Основные выводы анализа</h3>
        <div className="space-y-4 text-gray-700">
          <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <h4 className="font-semibold text-yellow-800 mb-2">1. Избыточная капитализация</h4>
            <p className="text-sm">Россия имеет капиталовооруженность выше оптимального уровня по золотому правилу (3.13 vs 1.64), что означает избыточное накопление капитала за счет потребления.</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800 mb-2">2. Приближение к устойчивому состоянию</h4>
            <p className="text-sm">Фактическая капиталовооруженность на 13% ниже расчетного устойчивого состояния, что указывает на продолжающийся процесс накопления капитала.</p>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-400">
            <h4 className="font-semibold text-red-800 mb-2">3. Влияние коронакризиса</h4>
            <p className="text-sm">2020 год показал временное снижение производительности труда при продолжающемся росте капиталовооруженности, что характерно для экономических шоков.</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
            <h4 className="font-semibent text-green-800 mb-2">4. Рекомендации по политике</h4>
            <p className="text-sm">Оптимальная норма сбережений составляет 8.6% вместо фактических 17.7%, что позволило бы увеличить потребление без ущерба для долгосрочного роста.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Модель Солоу для экономики России</h1>
          <p className="text-lg text-gray-600">Анализ оптимальных значений в период 2018-2022 годов</p>
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap justify-center space-x-1 bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('dynamics')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'dynamics'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Динамика показателей
            </button>
            <button
              onClick={() => setActiveTab('diagram')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'diagram'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Диаграмма Солоу
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'analysis'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Анализ и выводы
            </button>
          </div>
        </div>

        <div>
          {activeTab === 'dynamics' && renderDynamics()}
          {activeTab === 'diagram' && renderSolowDiagram()}
          {activeTab === 'analysis' && renderAnalysis()}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Источники данных: Росстат, ЦБ РФ, Минфин РФ</p>
          <p>Производственная функция: Y = A × K^α × L^(1-α), где α = 0.086, A = 1.385</p>
        </div>
      </div>
    </div>
  );
};

export default SolowModelRussia;