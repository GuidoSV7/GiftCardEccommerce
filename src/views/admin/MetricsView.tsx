import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFinancialMetrics, getDailyEarnings, type FinancialFilters } from '../../services/financeService';

export default function MetricsView() {
  const [selectedPeriod, setSelectedPeriod] = useState<'complete' | 'current' | 'previous'>('complete');
  const [selectedMonth, setSelectedMonth] = useState(9); // Septiembre
  const [selectedYear, setSelectedYear] = useState(2025);

  const filters: FinancialFilters = {
    period: 'month',
    month: selectedMonth,
    year: selectedYear
  };

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['financial-metrics', filters],
    queryFn: () => getFinancialMetrics(filters),
  });

  const { data: dailyEarnings, isLoading: earningsLoading } = useQuery({
    queryKey: ['daily-earnings', selectedMonth, selectedYear],
    queryFn: () => getDailyEarnings(selectedMonth, selectedYear),
  });

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const maxEarning = dailyEarnings ? Math.max(...dailyEarnings.map(d => d.amount)) : 0;

  if (metricsLoading || earningsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Finanzas</h1>
          <div className="flex items-center text-sm text-gray-600">
            <span>Admin</span>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span>Finanzas</span>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-lg font-semibold text-gray-900">
                {months[selectedMonth - 1]} {selectedYear}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="text-sm text-gray-500">Mes anterior</span>
            <span className="text-sm text-blue-600 font-medium cursor-pointer">Mes actual</span>
            <span className="text-sm text-gray-500">Mes siguiente</span>
            <button
              onClick={handleNextMonth}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filtrar por período</span>
              <div className="flex space-x-2">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="complete">Mes completo</option>
                  <option value="current">Período actual</option>
                  <option value="previous">Período anterior</option>
                </select>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Ingresos Totales */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Ingresos Totales</h3>
              <svg className="w-5 h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="text-2xl font-bold mb-1">$ {metrics?.totalIncome.toFixed(2)} USD</div>
            <div className="text-xs text-blue-100">Período: {metrics?.period}</div>
          </div>

          {/* Gastos Totales */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Gastos Totales</h3>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-orange-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <svg className="w-4 h-4 text-orange-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728" />
                </svg>
                <button className="text-white hover:bg-white/20 rounded p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">$ {metrics?.totalExpenses.toFixed(2)}</div>
            <div className="text-xs text-orange-100">Costos de proveedores</div>
          </div>

          {/* Beneficio Neto */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Beneficio Neto</h3>
            </div>
            <div className="text-2xl font-bold mb-1">$ {metrics?.netProfit.toFixed(2)} USD</div>
            <div className="text-xs text-green-100">Margen: {metrics?.profitMargin.toFixed(1)}%</div>
          </div>

          {/* Órdenes Procesadas */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-white">Órdenes Procesadas</h3>
            </div>
            <div className="text-2xl font-bold mb-1">{metrics?.processedOrders}</div>
            <div className="text-xs text-purple-100">Ganancia promedio: 0.48</div>
          </div>
        </div>

        {/* Daily Earnings Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              📊 Ganancias Diarias (price - price_provider)
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">Ganancia Diaria</span>
              </div>
            </div>
            
            {/* Chart */}
            <div className="mt-4">
              <div className="flex items-end space-x-1 h-32">
                {dailyEarnings?.map((earning, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="bg-green-500 rounded-t w-full transition-all duration-300 hover:bg-green-600"
                      style={{
                        height: `${(earning.amount / maxEarning) * 100}%`,
                        minHeight: '4px'
                      }}
                      title={`Día ${earning.day}: $${earning.amount.toFixed(2)}`}
                    ></div>
                  </div>
                ))}
              </div>
              
              {/* X-axis labels */}
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>1/9</span>
                <span>7/9</span>
                <span>14/9</span>
                <span>21/9</span>
                <span>28/9</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods & Top Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods Statistics */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">Estadísticas de Métodos de Pago</h3>
            </div>

            <div className="space-y-4">
              {/* Stripe */}
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Stripe</div>
                    <div className="text-sm text-gray-500">45 transacciones este mes</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">$ 2,450.75 USD</div>
                  <div className="text-sm text-green-600">+12.5% vs mes anterior</div>
                </div>
              </div>

              {/* Estadísticas adicionales */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Transacciones exitosas</div>
                  <div className="text-xl font-bold text-gray-900">98.2%</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Tiempo promedio</div>
                  <div className="text-xl font-bold text-gray-900">2.3s</div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4 mt-6">
                <div className="flex items-center justify-between p-4 bg-purple-600 text-white rounded-lg">
                  <div className="font-semibold">TOTAL PROCESADO</div>
                  <div className="text-right">
                    <div className="font-bold text-xl">$ 2,450.75 USD</div>
                    <div className="text-sm text-purple-200">Este mes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 10 Most Profitable Services */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900">Top 10 Servicios Más Rentables</h3>
              </div>
            </div>

            <div className="space-y-3">
              {/* Service Headers */}
              <div className="grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wider pb-2 border-b">
                <div className="col-span-6">SERVICIO</div>
                <div className="col-span-2 text-center">INGRESOS</div>
                <div className="col-span-2 text-center">COSTOS</div>
                <div className="col-span-2 text-center">GANANCIA</div>
              </div>

              {/* Service Items */}
              <div className="space-y-2">
                {/* Facebook Followers */}
                <div className="grid grid-cols-12 gap-2 items-center p-2 hover:bg-gray-50 rounded">
                  <div className="col-span-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📘</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Seguidores Reales para tu Página/Perfil de Facebook</div>
                      <div className="text-xs text-gray-500">1,000-4,100k seguidores/día | Garantía por 30 días</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm">$240.50</div>
                  <div className="col-span-2 text-center text-sm">$1,620</div>
                  <div className="col-span-2 text-center text-sm font-semibold text-green-600">$17</div>
                </div>

                {/* Instagram Followers */}
                <div className="grid grid-cols-12 gap-2 items-center p-2 hover:bg-gray-50 rounded">
                  <div className="col-span-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-pink-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">📷</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Instagram Followers | Real Quality | Instant</div>
                      <div className="text-xs text-gray-500">Max 5M | 100-30k Day | Cancel Enable | 30D</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm">$186.74</div>
                  <div className="col-span-2 text-center text-sm">$3,038</div>
                  <div className="col-span-2 text-center text-sm font-semibold text-green-600">$9</div>
                </div>

                {/* TikTok Followers */}
                <div className="grid grid-cols-12 gap-2 items-center p-2 hover:bg-gray-50 rounded">
                  <div className="col-span-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                      <span className="text-white text-xs">🎵</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">TikTok Followers | 30k/Day | 110 | Instant | 30 days Refill</div>
                      <div className="text-xs text-gray-500">High quality followers</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm">$183.00</div>
                  <div className="col-span-2 text-center text-sm">$5,000</div>
                  <div className="col-span-2 text-center text-sm font-semibold text-green-600">$6</div>
                </div>

                {/* TikTok PK Battle Points */}
                <div className="grid grid-cols-12 gap-2 items-center p-2 hover:bg-gray-50 rounded">
                  <div className="col-span-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">⚔️</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">TikTok PK BATTLE POINTS</div>
                      <div className="text-xs text-gray-500">Non Drop | 2 Minute | Min 1</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm">$240.00</div>
                  <div className="col-span-2 text-center text-sm">$3,000</div>
                  <div className="col-span-2 text-center text-sm font-semibold text-green-600">$6</div>
                </div>

                {/* TikTok Video Views */}
                <div className="grid grid-cols-12 gap-2 items-center p-2 hover:bg-gray-50 rounded">
                  <div className="col-span-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">👁️</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">TikTok Video Views | Instant Start | Fast | Cancel button Enable</div>
                      <div className="text-xs text-gray-500">High quality views</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm">$32.00</div>
                  <div className="col-span-2 text-center text-sm">$3,000</div>
                  <div className="col-span-2 text-center text-sm font-semibold text-green-600">$2</div>
                </div>

                {/* TikTok Followers Refill */}
                <div className="grid grid-cols-12 gap-2 items-center p-2 hover:bg-gray-50 rounded">
                  <div className="col-span-6 flex items-center space-x-2">
                    <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs">🔄</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">TikTok - Followers - % 100 PERFILES REALES MUNDO - REFILL 30D</div>
                      <div className="text-xs text-gray-500">Real profiles with refill guarantee</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm">$32.00</div>
                  <div className="col-span-2 text-center text-sm">$3,000</div>
                  <div className="col-span-2 text-center text-sm font-semibold text-green-600">$2</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
