// ui.js
import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { FilterNode, MathNode, TimerNode, ApiNode, ConditionNode } from './nodes/newNodes';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  math: MathNode,
  timer: TimerNode,
  api: ApiNode,
  condition: ConditionNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  initializeHistory: state.initializeHistory,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      initializeHistory,
    } = useStore(selector, shallow);

    // Initialize history on mount
    useEffect(() => {
      initializeHistory();
    }, [initializeHistory]);

    const getInitNodeData = (nodeID, type) => {
      let nodeData = { id: nodeID, nodeType: `${type}` };
      return nodeData;
    }

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div style={{
          margin: '0 24px 24px',
          height: '65vh',
          minHeight: '500px',
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)',
            overflow: 'hidden',
            position: 'relative',
            animation: 'fadeIn 0.6s ease-out 0.1s both'
          }}>
            {/* Canvas Header */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              padding: '16px 20px',
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), transparent)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderBottom: '1px solid rgba(0,0,0,0.05)',
              zIndex: 5,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#48bb78',
                boxShadow: '0 0 8px rgba(72, 187, 120, 0.5)',
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                Pipeline Canvas
              </span>
              <div style={{
                marginLeft: 'auto',
                display: 'flex',
                gap: '8px',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                <span style={{
                  padding: '4px 10px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '6px',
                  fontWeight: '600',
                  color: '#667eea'
                }}>
                  {nodes.length} nodes
                </span>
                <span style={{
                  padding: '4px 10px',
                  background: 'rgba(118, 75, 162, 0.1)',
                  borderRadius: '6px',
                  fontWeight: '600',
                  color: '#764ba2'
                }}>
                  {edges.length} connections
                </span>
              </div>
            </div>

            <div ref={reactFlowWrapper} style={{width: '100%', height: '100%', paddingTop: '56px'}}>
              <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onInit={setReactFlowInstance}
                  nodeTypes={nodeTypes}
                  proOptions={proOptions}
                  snapGrid={[gridSize, gridSize]}
                  connectionLineType='smoothstep'
                  defaultEdgeOptions={{
                    style: { 
                      strokeWidth: 2.5, 
                      stroke: '#667eea'
                    },
                    type: 'smoothstep',
                    animated: true,
                    markerEnd: {
                      type: 'arrowclosed',
                      width: 20,
                      height: 20,
                      color: '#667eea'
                    }
                  }}
                  deleteKeyCode={null} // Disable default delete behavior (we handle it in ToolbarControls)
              >
                  <Background 
                    color="#e5e7eb" 
                    gap={gridSize} 
                    size={1}
                    style={{ opacity: 0.5 }}
                  />
                  <Controls 
                    style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                    showInteractive={false}
                  />
                  <MiniMap 
                    style={{
                      background: 'rgba(255, 255, 255, 0.9)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                      overflow: 'hidden'
                    }}
                    maskColor="rgba(0, 0, 0, 0.05)"
                    nodeColor={(node) => {
                      const colors = {
                        customInput: '#4299e1',
                        customOutput: '#48bb78',
                        llm: '#ed8936',
                        text: '#9f7aea',
                        filter: '#f6ad55',
                        math: '#38b2ac',
                        timer: '#f56565',
                        api: '#68d391',
                        condition: '#b794f6'
                      };
                      return colors[node.type] || '#718096';
                    }}
                  />
              </ReactFlow>
            </div>

            <style>{`
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: scale(0.98);
                }
                to {
                  opacity: 1;
                  transform: scale(1);
                }
              }

              @keyframes pulse {
                0%, 100% {
                  opacity: 1;
                  transform: scale(1);
                }
                50% {
                  opacity: 0.6;
                  transform: scale(1.1);
                }
              }

              .react-flow__node {
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
              }

              .react-flow__node.selected {
                box-shadow: 0 0 0 2px #667eea, 0 8px 24px rgba(102, 126, 234, 0.3) !important;
              }

              .react-flow__edge-path {
                transition: stroke-width 0.2s ease;
              }

              .react-flow__edge.selected .react-flow__edge-path,
              .react-flow__edge:hover .react-flow__edge-path {
                stroke-width: 3.5;
              }

              .react-flow__handle {
                width: 10px;
                height: 10px;
                border: 2px solid white;
                transition: all 0.2s ease;
              }

              .react-flow__handle:hover {
                width: 14px;
                height: 14px;
                box-shadow: 0 0 8px rgba(102, 126, 234, 0.5);
              }

              .react-flow__controls-button {
                background: white !important;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
                transition: all 0.15s ease !important;
              }

              .react-flow__controls-button:hover {
                background: #f9fafb !important;
                transform: scale(1.05);
              }

              .react-flow__controls-button svg {
                fill: #374151 !important;
              }
            `}</style>
          </div>
    );
};