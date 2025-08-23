


export default function DashboardView() {
  return (
    <div className="w-full">
      {/* Contenido Principal */}
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Pagos</h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
            ADD PAYMENT
          </button>
        </div>

        {/* Tabla de Pagos */}
        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm border-b">
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">USER</th>
                <th className="px-6 py-4 font-medium">PREVIOUS BALANCE</th>
                <th className="px-6 py-4 font-medium">AMOUNT</th>
                <th className="px-6 py-4 font-medium">METHOD</th>
                <th className="px-6 py-4 font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr className="text-sm text-gray-600 hover:bg-gray-50">
                <td className="px-6 py-4">2478</td>
                <td className="px-6 py-4">
                  <div>fullmoviesec593</div>
                  <div className="text-xs text-gray-400">ID: 17</div>
                </td>
                <td className="px-6 py-4">$1.91</td>
                <td className="px-6 py-4 text-green-500">$10.00</td>
                <td className="px-6 py-4">stripe</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    completed
                  </span>
                </td>
              </tr>
              <tr className="text-sm text-gray-600 hover:bg-gray-50">
                <td className="px-6 py-4">2477</td>
                <td className="px-6 py-4">
                  <div>Melody</div>
                  <div className="text-xs text-gray-400">ID: 540</div>
                </td>
                <td className="px-6 py-4">$1.18</td>
                <td className="px-6 py-4 text-green-500">$10.00</td>
                <td className="px-6 py-4">stripe</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    completed
                  </span>
                </td>
              </tr>
              <tr className="text-sm text-gray-600 hover:bg-gray-50">
                <td className="px-6 py-4">2476</td>
                <td className="px-6 py-4">
                  <div>HetaxDigital</div>
                  <div className="text-xs text-gray-400">ID: 407</div>
                </td>
                <td className="px-6 py-4">$1.43</td>
                <td className="px-6 py-4 text-green-500">$3.00</td>
                <td className="px-6 py-4">binance_pay_gateway</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    completed
                  </span>
                </td>
              </tr>
              <tr className="text-sm text-gray-600 hover:bg-gray-50">
                <td className="px-6 py-4">2475</td>
                <td className="px-6 py-4">
                  <div>Guido</div>
                  <div className="text-xs text-gray-400">ID: 282</div>
                </td>
                <td className="px-6 py-4">$0.00</td>
                <td className="px-6 py-4 text-green-500">$10.00</td>
                <td className="px-6 py-4">veripagos</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                    pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
