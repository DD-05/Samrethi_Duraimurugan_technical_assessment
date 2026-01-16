// outputNode.js
import { Handle, Position } from 'reactflow';
import { BaseNode } from '../baseNode';

export const OutputNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Output"
      fields={[
        {
          name: 'outputName',
          label: 'Name',
          type: 'text',
          defaultValue: id.replace('customOutput-', 'output_')
        },
        {
          name: 'outputType',
          label: 'Type',
          type: 'select',
          options: ['Text', 'Image'],
          defaultValue: 'Text'
        }
      ]}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-value`
        }
      ]}
    />
  );
};
