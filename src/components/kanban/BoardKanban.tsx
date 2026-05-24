import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { PropertyData } from '../PropertyCard';
import { PropertyCardKanban } from './PropertyCardKanban';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export const KANBAN_COLUMNS = [
  { id: 'leads', title: 'Leads & Estimations' },
  { id: 'collecte', title: 'Collecte Documentaire' },
  { id: 'validation', title: 'Validation Pro' },
  { id: 'expertise', title: 'Contre-Expertise / Offre' },
  { id: 'mandat', title: 'Mandat & Commercialisation' },
  { id: 'notaire', title: 'Chez le Notaire' },
  { id: 'clos', title: 'Signé / Clos' },
];

interface BoardKanbanProps {
  properties: PropertyData[];
  onDragEnd: (result: DropResult) => void;
  onOpenAgrafe: (prop: PropertyData) => void;
  onSelectProperty?: (prop: PropertyData) => void;
}

export const BoardKanban: React.FC<BoardKanbanProps> = ({ properties, onDragEnd, onOpenAgrafe, onSelectProperty }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-8 pt-4 px-2 no-scrollbar min-h-[50vh] snap-x snap-mandatory">
        {KANBAN_COLUMNS.map(column => {
          const columnProps = properties.filter(
            p => (p.pipelineStage || 'leads') === column.id
          );
          
          return (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "flex-shrink-0 w-[85vw] sm:w-80 flex flex-col gap-4 rounded-[2rem] p-4 transition-all duration-300 border snap-center",
                    snapshot.isDraggingOver 
                      ? "bg-gray-50 dark:bg-white/5 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.15)]" 
                      : "bg-white dark:bg-white/5 backdrop-blur-xl border-gray-200 dark:border-white/10 shadow-xl dark:shadow-2xl"
                  )}
                >
                  <div className="flex items-center justify-between px-2 mb-2">
                    <h3 className="font-medium text-slate-900 dark:!text-white/90 text-sm tracking-wide">{column.title}</h3>
                    <span className="bg-gray-200 dark:bg-white/10 text-slate-900 dark:!text-white text-xs font-bold px-2.5 py-1 rounded-full border border-gray-300 dark:border-white/10 shadow-sm">
                      {columnProps.length}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-h-[150px] space-y-4">
                    {columnProps.map((prop, index) => (
                      // @ts-ignore - key is valid in React
                      <Draggable key={prop.id} draggableId={prop.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              transform: snapshot.isDragging && provided.draggableProps.style?.transform
                                ? `${provided.draggableProps.style.transform} rotate(2deg)`
                                : provided.draggableProps.style?.transform,
                              zIndex: snapshot.isDragging ? 999 : 1
                            }}
                            onClick={() => onSelectProperty && onSelectProperty(prop)}
                            className={cn(
                              "transition-shadow duration-200 cursor-grab active:cursor-grabbing",
                              snapshot.isDragging ? "shadow-2xl opacity-90 drop-shadow-2xl" : ""
                            )}
                          >
                            <PropertyCardKanban property={prop} onOpenAgrafe={() => onOpenAgrafe(prop)} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
};
