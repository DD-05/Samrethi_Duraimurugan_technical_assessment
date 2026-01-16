// nodes/textNode.js
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [text, setText] = useState(data?.text || '');
  const [variables, setVariables] = useState([]);
  const [dimensions, setDimensions] = useState({ width: 220, height: 'auto' });
  const textareaRef = useRef(null);

  // Extract variables from text (e.g., {{ variableName }})
  useEffect(() => {
    const variablePattern = /\{\{\s*(\w+)\s*\}\}/g;
    const matches = [...text.matchAll(variablePattern)];
    const uniqueVars = [...new Set(matches.map(match => match[1]))];
    setVariables(uniqueVars);
  }, [text]);

  // Auto-resize based on content
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      
      // Reset height to get accurate scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new dimensions
      const newHeight = Math.max(80, Math.min(400, textarea.scrollHeight + 20));
      const textLength = text.length;
      const newWidth = Math.max(220, Math.min(500, 220 + Math.floor(textLength / 3)));
      
      setDimensions({
        width: newWidth,
        height: newHeight
      });
    }
  }, [text]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    updateNodeField(id, 'text', newText);
  };

  const nodeColor = '#9f7aea';

  return (
    <div 
      style={{
        width: `${dimensions.width}px`,
        minHeight: '100px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
        border: `2px solid ${nodeColor}30`,
        borderRadius: '16px',
        boxShadow: `0 4px 12px ${nodeColor}20, 0 0 0 1px ${nodeColor}10`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${nodeColor}30, 0 0 0 2px ${nodeColor}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 12px ${nodeColor}20, 0 0 0 1px ${nodeColor}10`;
      }}
    >
      {/* Dynamic Variable Handles on the Left */}
      {variables.map((variable, index) => (
        <Handle
          key={`var-${variable}`}
          type="target"
          position={Position.Left}
          id={`${id}-${variable}`}
          style={{
            top: `${60 + (index * 30)}px`,
            width: '10px',
            height: '10px',
            background: nodeColor,
            border: '2px solid white',
            boxShadow: `0 0 8px ${nodeColor}50`,
            transition: 'all 0.2s ease'
          }}
        />
      ))}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        style={{
          width: '10px',
          height: '10px',
          background: nodeColor,
          border: '2px solid white',
          boxShadow: `0 0 8px ${nodeColor}50`,
          transition: 'all 0.2s ease'
        }}
      />

      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${nodeColor} 0%, ${nodeColor}dd 100%)`,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderBottom: `1px solid ${nodeColor}20`
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}>
          📝
        </div>
        <div style={{
          fontWeight: '700',
          color: 'white',
          fontSize: '14px',
          letterSpacing: '0.3px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}>
          Text
        </div>
        {variables.length > 0 && (
          <div style={{
            marginLeft: 'auto',
            padding: '4px 8px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            color: 'white'
          }}>
            {variables.length} var{variables.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        <label style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: '600',
          color: '#374151',
          marginBottom: '8px'
        }}>
          Text Content
        </label>
        
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          placeholder="Enter text here... Use {{ variableName }} for variables"
          style={{
            width: '100%',
            minHeight: '60px',
            height: dimensions.height === 'auto' ? 'auto' : `${dimensions.height - 100}px`,
            padding: '10px 12px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '13px',
            background: 'white',
            color: '#374151',
            resize: 'none',
            fontFamily: 'inherit',
            lineHeight: '1.5',
            transition: 'all 0.15s ease',
            outline: 'none',
            overflow: 'auto'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = nodeColor;
            e.target.style.boxShadow = `0 0 0 3px ${nodeColor}20`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
        />

        {/* Variable Tags Display */}
        {variables.length > 0 && (
          <div style={{
            marginTop: '12px',
            padding: '10px 12px',
            background: 'linear-gradient(135deg, rgba(159, 122, 234, 0.1) 0%, rgba(128, 90, 213, 0.05) 100%)',
            borderRadius: '8px',
            border: `1px solid ${nodeColor}20`
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Detected Variables
            </div>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px'
            }}>
              {variables.map((variable) => (
                <div
                  key={variable}
                  style={{
                    padding: '4px 10px',
                    background: 'white',
                    border: `1px solid ${nodeColor}30`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: nodeColor,
                    fontFamily: 'monospace',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: `0 1px 3px ${nodeColor}10`
                  }}
                >
                  <span style={{ fontSize: '10px', opacity: 0.6 }}>📌</span>
                  {variable}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};