// llmNode.js
import { Handle, Position } from 'reactflow';
import { BaseNode } from '../baseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      fields={[]}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-system`,
          style: { top: '33%' }
        },
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-prompt`,
          style: { top: '67%' }
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-response`
        }
      ]}
    />
  );
};
