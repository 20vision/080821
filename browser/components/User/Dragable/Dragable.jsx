import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DnDVertical from "../../../assets/DnDVertical";

export default function Dragable({items, setItems}){    

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
      
        return result;
    };

    return (
        <DragDropContext onDragEnd={(result) => {
                if (!result.destination) {
                    return;
                }

                const new_items = reorder(
                    items,
                    result.source.index,
                    result.destination.index
                );

                setItems(new_items)
            }}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                >
                    {items && items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                            {(provided, snapshot) => {
                                provided.draggableProps.style = {
                                    ...provided.draggableProps.style,
                                    ...{
                                        borderRadius: '15px',
                                        padding: '15px',
                                        backgroundColor: 'white',
                                        marginBottom: '25px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }
                                }
                                if (snapshot.isDragging) {
                                    const offset = { x: '10vw', y: '10vh' }          // your fixed container left/top position
                                    const x = provided.draggableProps.style.left - offset.x;
                                    const y = provided.draggableProps.style.top - offset.y;
                                    provided.draggableProps.style.left = x;
                                    provided.draggableProps.style.top = y;
                                    provided.draggableProps.style.backgroundColor = '#999';
                                }
                                return(
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <DnDVertical color=''/>
                                        <div style={{marginLeft: '15px'}}>
                                            {item.content}
                                        </div>
                                    </div>
                            )}}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
