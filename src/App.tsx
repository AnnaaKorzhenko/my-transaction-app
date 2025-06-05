import { useState } from 'react';
import './App.css';

  function App() {
    const [cardNumber, setCardNumber] = useState<string>('');
    const [expiry, setExpiry] = useState<string>('');
    const [cvc, setCvc] = useState<string>('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
      if (!cardNumber || cardNumber.length !== 16 || isNaN(Number(cardNumber))) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        newErrors.expiry = 'Expiry must be in MM/YY format';
      } 
      else {
        const [month, year] = expiry.split('/').map(Number);
        if (month < 1 || month > 12) {
          newErrors.expiry = 'Month must be between 01 and 12';
        } 
        else {
          const expiryDate = new Date(2000 + year, month - 1); // Months are 0-based in JS
          const today = new Date(); // Get the current date dynamically
          const currentYear = today.getFullYear();
          const currentMonth = today.getMonth(); // 0-based (0 = January, 11 = December)
          const currentDate = new Date(currentYear, currentMonth); // Set to the 1st of the current month for comparison
          if (expiryDate < currentDate) {
            newErrors.expiry = 'Expiry date cannot be in the past';
          }
        }
      }
      
      if (!cvc || cvc.length !== 3 || isNaN(Number(cvc))) {
        newErrors.cvc = 'CVC must be 3 digits';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setIsSuccess(true);
      }, 2000);
    };

    const formatCardNumber = (value: string): string => {
      return value.replace(/\D/g, '').slice(0, 16);
    };

    const formatExpiry = (value: string): string => {
      const clean = value.replace(/\D/g, '').slice(0, 4);
      if (clean.length > 2) return `${clean.slice(0, 2)}/${clean.slice(2)}`;
      return clean;
    };

    return (
      <div className="container">
        {isSuccess ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-gray-600">Your trial has started.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold">Checkout</h1>
              <p className="text-lg font-bold">5 days free</p>
              <p className="text-lg">then 299.99 UAH per 14 days</p>
            </div>

            <button className="apple-pay-btn">
              <span className="apple-pay-icon"></span> Pay
            </button>

            <div className="text-center text-gray-500 mb-4">or pay with card</div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label>Card Number</label>
                <input
                  type="text"
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 1234 1234 1234"
                  className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                />
                {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
              </div>

              <div className="input-group">
                <div>
                  <label>Expiration Date</label>
                  <input
                    type="text"
                    value={formatExpiry(expiry)}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    className={`form-input ${errors.expiry ? 'error' : ''}`}
                  />
                  {errors.expiry && <p className="error-message">{errors.expiry}</p>}
                </div>
                <div>
                  <label>CVC</label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="***"
                    className={`form-input ${errors.cvc ? 'error' : ''}`}
                  />
                  {errors.cvc && <p className="error-message">{errors.cvc}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="submit-btn"
              >
                {isProcessing ? (
                  <>
                    <svg className="spinner" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Processing payment
                  </>
                ) : (
                  'Pay 299.99 UAH'
                )}
              </button>
            </form>

            <p className="text-xs">
              You'll have the Plan Pro during the 1 year. After this period of time, your plan will be automatically renewed with its original price, without any discounts applied.
            </p>

            <div className="order-info">
              <h3>Order info</h3>
              <p className="text-sm">Lamel Professional Smart Skin Compact Powder</p>
              <p className="text-sm">Пудра для лиця</p>
              <p className="text-lg font-bold">299.99 UAH/month</p>
            </div>

            <div className="footer">Powered by Solid</div>
          </>
        )}
      </div>
    );
  }

  export default App;