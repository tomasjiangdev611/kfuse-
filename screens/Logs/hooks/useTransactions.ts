import { useState } from 'react';

const initialState = null;

const useTransactions = () => {
  const [state, setState] = useState(initialState);

  const onMessage = (message) => {
    const transactions = message.payload?.data?.getTransactions;
    if (transactions && transactions.pathStats) {
      setState(transactions);
    }
  };

  const clear = () => {
    setState({ ...initialState });
  };

  return {
    clear,
    onMessage,
    state,
  };
};

export default useTransactions;
