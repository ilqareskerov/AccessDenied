
import React, { useState } from 'react';
import { Project } from '../types';
import { useInvestment } from '../contexts/InvestmentContext';
import Button from './common/Button';
import AlertMessage from './common/AlertMessage';

interface InvestmentModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onInvestmentSuccess: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ project, isOpen, onClose, onInvestmentSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { makeInvestment } = useInvestment();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and ensure it's positive
    if (/^\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const investmentAmount = parseInt(amount, 10);

    if (isNaN(investmentAmount) || investmentAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }
    if (investmentAmount < 10) { // Example minimum investment
      setError('Minimum investment amount is AZN 10.');
      return;
    }

    setIsProcessing(true);
    const success = await makeInvestment(project.id, project.name, investmentAmount);
    setIsProcessing(false);

    if (success) {
      setAmount('');
      onInvestmentSuccess();
      onClose();
    } else {
      setError('Investment failed. Please try again or check your balance.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-pasha-blue">Invest in {project.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        
        {error && <AlertMessage type="error" message={error} onClose={() => setError(null)} />}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="investmentAmount" className="block text-sm font-medium text-pasha-gray-dark mb-1">
              Investment Amount (AZN)
            </label>
            <input
              type="text"
              id="investmentAmount"
              value={amount}
              onChange={handleAmountChange}
              className="w-full px-3 py-2 border border-pasha-gray rounded-md shadow-sm focus:ring-pasha-blue focus:border-pasha-blue"
              placeholder="e.g., 100"
              disabled={isProcessing}
            />
          </div>

          <div className="text-sm text-pasha-gray-dark mb-6">
            <p>You are about to invest <span className="font-bold text-pasha-blue">AZN {amount || '0'}</span> in "{project.name}".</p>
            <p className="text-xs mt-1">Investments are subject to risk. Please invest responsibly.</p>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isProcessing} disabled={isProcessing || !amount || parseInt(amount) <= 0}>
              Confirm Investment
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestmentModal;
