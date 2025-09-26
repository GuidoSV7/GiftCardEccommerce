import { useState } from 'react';

interface PaymentMethod {
  id: number;
  method: string;
  name: string;
  description: string;
  min: number;
  max: number;
  newUsers: boolean;
  status: 'allowed' | 'disabled';
}

export const PaymentMethods = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  
  // Datos de ejemplo - solo Stripe por ahora
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 1,
      method: 'stripe',
      name: 'Stripe | Desde $1 USD',
      description: 'Tarjeta / Apple Pay / Amazonpay, etc. | Desde $10 USD | Mundial',
      min: 1.00,
      max: 10000.00,
      newUsers: true,
      status: 'allowed'
    }
  ]);

  const handleEdit = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMethod) {
      setPaymentMethods(prev => 
        prev.map(method => 
          method.id === selectedMethod.id ? selectedMethod : method
        )
      );
    }
    setEditModalOpen(false);
    setSelectedMethod(null);
  };

  const handleToggleStatus = (methodId: number) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === methodId 
          ? { ...method, status: method.status === 'allowed' ? 'disabled' : 'allowed' }
          : method
      )
    );
  };

  const handleToggleNewUsers = (methodId: number) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === methodId 
          ? { ...method, newUsers: !method.newUsers }
          : method
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Add Method
        </button>
      </div>

      {/* Payment Methods Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  METHOD
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NAME
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MIN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MAX
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NEW USERS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentMethods.map((method) => (
                <tr key={method.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg mr-2">💳</span>
                      <span className="text-sm font-medium text-gray-900">{method.method}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-gray-500 text-xs mt-1">{method.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${method.min.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${method.max.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      method.newUsers ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {method.newUsers ? 'Allowed' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={method.status === 'allowed'}
                          onChange={() => handleToggleStatus(method.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                      <span className={`ml-3 text-xs font-medium px-2 py-1 rounded ${
                        method.status === 'allowed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {method.status === 'allowed' ? 'Allowed' : 'Disabled'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(method)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editModalOpen && selectedMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Payment Method</h2>
                <p className="text-gray-600">Update {selectedMethod.method} configuration</p>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={selectedMethod.name}
                  onChange={(e) => setSelectedMethod({...selectedMethod, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={selectedMethod.description}
                  onChange={(e) => setSelectedMethod({...selectedMethod, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedMethod.min}
                    onChange={(e) => setSelectedMethod({...selectedMethod, min: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedMethod.max}
                    onChange={(e) => setSelectedMethod({...selectedMethod, max: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
