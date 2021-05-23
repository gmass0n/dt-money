import { useMemo } from "react";
import incomeImg from "../../assets/income.svg";
import outcomeImg from "../../assets/outcome.svg";
import totalImg from "../../assets/total.svg";
import { useTransactions } from "../../hooks/transactions";
import { formatCurrency } from "../../utils/formatCurrency";

import { Container } from "./styles";

export const Summary: React.FC = () => {
  const { transactions } = useTransactions();

  const summary = useMemo(
    () =>
      transactions.reduce(
        (acc, transaction) => {
          if (transaction.type === "deposit") {
            acc.deposits += transaction.amount;
            acc.total += transaction.amount;
          } else {
            acc.withdraws += transaction.amount;
            acc.total -= transaction.amount;
          }

          return acc;
        },
        {
          deposits: 0,
          withdraws: 0,
          total: 0,
        }
      ),
    [transactions]
  );

  return (
    <Container>
      <li>
        <header>
          <p>Entradas</p>
          <img src={incomeImg} alt="Entradas" />
        </header>

        <strong>{formatCurrency(summary.deposits)}</strong>
      </li>

      <li>
        <header>
          <p>Saidas</p>
          <img src={outcomeImg} alt="Saidas" />
        </header>

        <strong>-{formatCurrency(summary.withdraws)}</strong>
      </li>

      <li className="highlight-background">
        <header>
          <p>Total</p>
          <img src={totalImg} alt="Total" />
        </header>

        <strong>{formatCurrency(summary.total)}</strong>
      </li>
    </Container>
  );
};
