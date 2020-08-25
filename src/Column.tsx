import React, { useRef } from "react";

import { ColumnContainer, ColumnTitle } from "./styles";
import { AddNewItem } from "./AddNewItem";
import { Card } from "./Card";
import { useAppState } from "./AppStateContext";
import { useItemDrag } from "./useItemDrag";
import { useDrop } from "react-dnd";
import { DragItem } from "./DragItem";
import { isHidden } from "./utils/isHidden";

interface ColumnProps {
	text: string;
	index: number;
	id: string;
	isPreview?: boolean;
}

export const Column = ({ text, index, id, isPreview }: React.PropsWithChildren<ColumnProps>) => {
	const { state, dispatch } = useAppState();
	const ref = useRef<HTMLDivElement>(null);

	const [, drop] = useDrop({
		accept: ["COLUMN", "CARD"],
		hover(item: DragItem) {
			if (item.type === "COLUMN") {
				const dragIndex = item.index;
				const hoverIndex = index;
				if (dragIndex === hoverIndex) {
					return;
				}
				dispatch({ type: "MOVE_LIST", payload: { dragIndex, hoverIndex } });
				item.index = hoverIndex;
			} else {
				const dragIndex = item.index;
				const hoverIndex = 0;
				const sourceColumn = item.columnId;
				const targetColumn = id;

				if (sourceColumn === targetColumn) {
					return;
				}

				dispatch({ type: "MOVE_TASK", payload: { dragIndex, hoverIndex, sourceColumn, targetColumn } });
				item.index = hoverIndex;
				item.columnId = targetColumn;
			}
		}
	});

	// console.log("isPreview", isPreview);
	const { drag } = useItemDrag({ type: "COLUMN", id, index, text });
	drag(drop(ref));

	return (
		<ColumnContainer ref={ref} isHidden={isHidden(isPreview, state.draggedItem, "COLUMN", id)} isPreview={isPreview}>
			<ColumnTitle>{text}</ColumnTitle>
			{state.lists[index].tasks.map((task, index) => (
				<Card text={task.text} key={task.id} id={task.id} columnId={id} index={index} />
			))}

			<AddNewItem toggleButtonText="+ Add another task" onAdd={(text) => dispatch({ type: "ADD_TASK", payload: { text, listId: id } })} dark />
		</ColumnContainer>
	);
};
