import { Component, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const getItemStyle = (isDragging, draggableStyle) => ({
  // styles we need to apply on draggables
  background: isDragging ? "lightgreen" : "grey",
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  left:0,
  top:0
});

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
};

export default function Dragable({list}){
    const [items, setItems] = useState([{id:0,content:'dsafds'},{id:1,content:'dsafdssdaf'},{id:2,content:'dsafsdads'}])
    
    return (
        <DragDropContext onDragEnd={(result) => {
            console.log('drag end')
            if (!result.destination) {
                return;
            }
            }}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                >
                    {items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                            {(provided, snapshot) => {
                                if (snapshot.isDragging) {
                                    const offset = { x: '10vw', y: '10vh' }          // your fixed container left/top position
                                    const x = provided.draggableProps.style.left - offset.x;
                                    const y = provided.draggableProps.style.top - offset.y;
                                    provided.draggableProps.style.left = x;
                                    provided.draggableProps.style.top = y;
                                 }
                                return(
                                <div style={getItemStyle(snapshot.isDragging,provided.draggableProps.style)}>
                                    <div
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        ref={provided.innerRef}
                                    >
                                        {item.content}
                                    </div>
                                    {provided.placeholder}
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
