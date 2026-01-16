// inputNode.js
import { Handle, Position } from 'reactflow';
import { BaseNode } from '../baseNode';

export const InputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Input"
      fields={[
        {
          name: 'inputName',
          label: 'Name',
          type: 'text',
          defaultValue: id.replace('customInput-', 'input_')
        },
        {
          name: 'inputType',
          label: 'Type',
          type: 'select',
          options: ['Text', 'File'],
          defaultValue: 'Text'
        }
      ]}
      handles={[
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-value`
        }
      ]}
    />
  );
};
