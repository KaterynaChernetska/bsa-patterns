import type { DraggableProvided } from "@hello-pangea/dnd";
import React from "react";

import type { Card } from "../../common/types";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";
import { socket } from "../../context/socket";
import { CardEvent } from "../../common/enums";

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  listId: string;
};

export const CardItem = ({ card, isDragging, provided, listId }: Props) => {
  const handleDeleteCard = (): void => {
    socket.emit(CardEvent.DELETE, listId, card.id);
  };

  const handleRenameCard = (name: string): void => {
    socket.emit(CardEvent.RENAME, name, listId, card.id);
  };

  const handleChangeDescription = (text: string): void => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, text, listId, card.id);
  };

  const handleCardCopy = (): void => {
    socket.emit(CardEvent.MAKE_COPY, listId, card.id);
  };

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={handleRenameCard}
          title={card.name}
          fontSize="large"
          bold={true}
        />
        <Text text={card.description} onChange={handleChangeDescription} />
        <Footer>
          <DeleteButton onClick={handleDeleteCard} />
          <Splitter />
          <CopyButton onClick={handleCardCopy} />
        </Footer>
      </Content>
    </Container>
  );
};
