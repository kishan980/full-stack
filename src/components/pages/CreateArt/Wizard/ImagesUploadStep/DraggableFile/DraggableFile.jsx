import { forwardRef, useImperativeHandle, useRef } from 'react';
import { DragSource, DropTarget, } from 'react-dnd';
import './draggable-file.scss'

const ItemTypes = {
  FILE: 'file',
}

const File = forwardRef(function File({ children, isDragging, connectDragSource, connectDropTarget }, ref) {
  const elementRef = useRef(null);
  connectDragSource(elementRef);
  connectDropTarget(elementRef);
  const opacity = isDragging ? 0 : 1;
  useImperativeHandle(ref, () => ({
    getNode: () => elementRef.current,
  }));
  return (
    <div ref={elementRef} style={{opacity}} className="draggable">
      {children}
    </div>
  );
});

export default DropTarget(ItemTypes.FILE, {
  hover(props, monitor, component) {
    if (!component) {
      return null;
    }
    // node = HTML Div element from imperative API
    const node = component.getNode();
    if (!node) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = node.getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
      return;
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
      return;
    }
    // Time to actually perform the action
    props.moveFile(dragIndex, hoverIndex);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
}, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))(DragSource(ItemTypes.FILE, {
  beginDrag: (props) => ({
    id: props.id,
    index: props.index,
  }),
}, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(File));
