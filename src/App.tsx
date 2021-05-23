import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";

import { TransactionsProvider } from "./hooks/transactions";

import { GlobalStyle } from "./styles/global";

export const App: React.FC = () => {
  return (
    <TransactionsProvider>
      <Header />
      <Dashboard />

      <GlobalStyle />
    </TransactionsProvider>
  );
};
