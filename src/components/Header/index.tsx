import { useCallback, useRef } from "react";
import logoImg from "../../assets/logo.svg";
import NewTransactionModal, {
  NewTransactionModalHandles,
} from "../NewTransactionModal";

import { Container, Content } from "./styles";

export const Header: React.FC = () => {
  const newTransactionModalRef = useRef<NewTransactionModalHandles>(null);

  const handleOpenNewTransactionModal = useCallback(() => {
    if (!newTransactionModalRef.current) return;

    newTransactionModalRef.current.openModal();
  }, []);

  return (
    <Container>
      <Content>
        <img src={logoImg} alt="dt money" />

        <button type="button" onClick={handleOpenNewTransactionModal}>
          Nova transação
        </button>

        <NewTransactionModal ref={newTransactionModalRef} />
      </Content>
    </Container>
  );
};
