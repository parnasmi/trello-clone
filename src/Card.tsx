import React, { useRef } from "react";
import { CardContainer } from "./styles";
import { useDrop } from "react-dnd";
import { DragItem, CardDragItem } from "./DragItem";
import { useAppState } from "./AppStateContext";
import { useItemDrag } from "./useItemDrag";
import { isHidden } from "./utils/isHidden";

interface CardProps {
	text: string;
	id: string;
	columnId: string;
	index: number;
	isPreview?: boolean;
}

export const Card = ({ text, id, columnId, index, isPreview }: CardProps) => {
	const { state, dispatch } = useAppState();
	const { drag } = useItemDrag({ type: "CARD", index, id, columnId, text });
	const ref = useRef<HTMLDivElement>(null);

	const [, drop] = useDrop({
		accept: "CARD",
		hover(item: CardDragItem) {
			if (item.type === "CARD") {
				if (item.id === id) {
					return;
				}
				const dragIndex = item.index;
				const hoverIndex = index;
				const sourceColumn = item.columnId;
				const targetColumn = columnId;
				dispatch({
					type: "MOVE_TASK",
					payload: { dragIndex, hoverIndex, sourceColumn, targetColumn }
				});
				item.index = hoverIndex;
				item.columnId = targetColumn;
			}
		}
	});

	drag(drop(ref));

	return (
		<CardContainer ref={ref} isHidden={isHidden(isPreview, state.draggedItem, "CARD", id)} isPreview={isPreview}>
			{text}
		</CardContainer>
	);
};
