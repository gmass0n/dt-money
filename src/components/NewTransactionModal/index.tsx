import {
  FormEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ReactModal from "react-modal";

import closeImg from "../../assets/close.svg";
import incomeImg from "../../assets/income.svg";
import outcomeImg from "../../assets/outcome.svg";
import { TransactionType, useTransactions } from "../../hooks/transactions";

import {
  Container,
  TransactionTypeContainer,
  TransactionTypeItem,
} from "./styles";

ReactModal.setAppElement("#root");

export interface NewTransactionModalHandles {
  openModal(): void;
  closeModal(): void;
}

const NewTransactionModal: React.ForwardRefRenderFunction<NewTransactionModalHandles> =
  (_, ref) => {
    const { createTransaction } = useTransactions();

    const titleRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLInputElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [transactionType, setTransactionType] =
      useState<TransactionType>("deposit");

    const openModal = useCallback(() => {
      setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
      setIsModalOpen(false);
    }, []);

    const handleCreateNewTransaction = useCallback(
      async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = {
          title: titleRef.current?.value || "",
          amount: Number(amountRef.current?.value) || 0,
          type: transactionType,
          category: categoryRef.current?.value || "",
        };

        await createTransaction(formData);

        closeModal();
      },
      [transactionType, createTransaction, closeModal]
    );

    useImperativeHandle(ref, () => ({
      openModal,
      closeModal,
    }));

    return (
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        shouldCloseOnEsc
        overlayClassName="react-modal-overlay"
        className="react-modal-content"
      >
        <button
          type="button"
          onClick={closeModal}
          className="react-modal-close"
        >
          <img src={closeImg} alt="Fechar modal" />
        </button>

        <Container onSubmit={handleCreateNewTransaction}>
          <h2>Cadastrar transação</h2>

          <input placeholder="Titúlo" ref={titleRef} />

          <input type="number" placeholder="Valor" ref={amountRef} />

          <TransactionTypeContainer>
            <TransactionTypeItem
              isSelected={transactionType === "deposit"}
              selectedColor="green"
            >
              <button
                type="button"
                onClick={() => setTransactionType("deposit")}
              >
                <img src={incomeImg} alt="Entrada" />

                <span>Entrada</span>
              </button>
            </TransactionTypeItem>

            <TransactionTypeItem
              isSelected={transactionType === "withdraw"}
              selectedColor="red"
            >
              <button
                type="button"
                onClick={() => setTransactionType("withdraw")}
              >
                <img src={outcomeImg} alt="Saída" />

                <span>Saída</span>
              </button>
            </TransactionTypeItem>
          </TransactionTypeContainer>

          <input placeholder="Categoria" ref={categoryRef} />

          <button type="submit">Cadastrar</button>
        </Container>
      </ReactModal>
    );
  };

export default forwardRef(NewTransactionModal);
