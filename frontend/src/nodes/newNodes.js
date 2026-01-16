// filterNode.js
import { Handle, Position } from 'reactflow';
import { BaseNode } from '../baseNode';

export const FilterNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Filter"
      fields={[
        {
          name: 'condition',
          label: 'Condition',
          type: 'select',
          options: ['equals', 'contains', 'greater_than', 'less_than'],
          defaultValue: 'equals'
        },
        {
          name: 'value',
          label: 'Value',
          type: 'text',
          defaultValue: ''
        }
      ]}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-input`
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-output`,
          style: { top: '40%' }
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-filtered`,
          style: { top: '60%' }
        }
      ]}
      style={{ backgroundColor: '#fef5e7' }}
    />
  );
};

// mathNode.js
export const MathNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Math"
      fields={[
        {
          name: 'operation',
          label: 'Operation',
          type: 'select',
          options: ['add', 'subtract', 'multiply', 'divide'],
          defaultValue: 'add'
        }
      ]}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-a`,
          style: { top: '30%' }
        },
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-b`,
          style: { top: '70%' }
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-result`
        }
      ]}
      style={{ backgroundColor: '#e6fffa' }}
    />
  );
};

// timerNode.js
export const TimerNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Timer"
      fields={[
        {
          name: 'delay',
          label: 'Delay (ms)',
          type: 'number',
          defaultValue: '1000'
        },
        {
          name: 'repeat',
          label: 'Repeat',
          type: 'select',
          options: ['once', 'continuous'],
          defaultValue: 'once'
        }
      ]}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-trigger`
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-output`
        }
      ]}
      style={{ backgroundColor: '#fff5f5' }}
    />
  );
};

// apiNode.js
export const ApiNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="API Call"
      fields={[
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          defaultValue: 'https://api.example.com'
        },
        {
          name: 'method',
          label: 'Method',
          type: 'select',
          options: ['GET', 'POST', 'PUT', 'DELETE'],
          defaultValue: 'GET'
        },
        {
          name: 'headers',
          label: 'Headers',
          type: 'textarea',
          rows: 2,
          defaultValue: '{}'
        }
      ]}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-data`
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-response`,
          style: { top: '40%' }
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-error`,
          style: { top: '60%' }
        }
      ]}
      style={{ backgroundColor: '#f0fff4' }}
    />
  );
};

// conditionNode.js
export const ConditionNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="Condition"
      fields={[
        {
          name: 'expression',
          label: 'Expression',
          type: 'text',
          defaultValue: 'x > 0'
        }
      ]}
      handles={[
        {
          type: 'target',
          position: Position.Left,
          id: `${id}-input`
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-true`,
          style: { top: '40%' }
        },
        {
          type: 'source',
          position: Position.Right,
          id: `${id}-false`,
          style: { top: '60%' }
        }
      ]}
      style={{ backgroundColor: '#faf5ff' }}
    />
  );
};