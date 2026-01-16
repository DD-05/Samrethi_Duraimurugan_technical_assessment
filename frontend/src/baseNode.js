// baseNode.js
import { useState } from 'react';
import { Handle } from 'reactflow';
import { useStore } from './store';

export const BaseNode = ({ 
  id, 
  data, 
  title, 
  fields = [], 
  handles = [], 
  style = {},
  icon = '📦',
  color = '#667eea'
}) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const [fieldValues, setFieldValues] = useState(() => {
    const initial = {};
    fields.forEach(field => {
      initial[field.name] = data?.[field.name] || field.defaultValue || '';
    });
    return initial;
  });

  const handleFieldChange = (fieldName, value) => {
    setFieldValues(prev => ({ ...prev, [fieldName]: value }));
    updateNodeField(id, fieldName, value);
  };

  const defaultStyle = {
    minWidth: 220,
    minHeight: 100,
    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
    border: `2px solid ${color}30`,
    borderRadius: '16px',
    padding: '0',
    boxShadow: `0 4px 12px ${color}20, 0 0 0 1px ${color}10`,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    ...style
  };

  return (
    <div 
      style={defaultStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}30, 0 0 0 2px ${color}40`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 4px 12px ${color}20, 0 0 0 1px ${color}10`;
      }}
    >
      {/* Handles */}
      {handles.map((handle, index) => (
        <Handle
          key={index}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={{
            width: '10px',
            height: '10px',
            background: color,
            border: '2px solid white',
            boxShadow: `0 0 8px ${color}50`,
            transition: 'all 0.2s ease',
            ...handle.style
          }}
        />
      ))}
      
      {/* Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderBottom: `1px solid ${color}20`
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
          {icon}
        </div>
        <div style={{ 
          fontWeight: '700', 
          color: 'white',
          fontSize: '14px',
          letterSpacing: '0.3px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}>
          {title}
        </div>
      </div>
      
      {/* Fields Container */}
      <div style={{ padding: '16px' }}>
        {fields.map((field, index) => (
          <div key={index} style={{ marginBottom: index === fields.length - 1 ? 0 : '12px' }}>
            <label style={{ 
              display: 'block',
              fontSize: '12px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '6px'
            }}>
              {field.label}
            </label>
            {field.type === 'select' ? (
              <select 
                value={fieldValues[field.name]} 
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = color;
                  e.target.style.boxShadow = `0 0 0 3px ${color}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {field.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                value={fieldValues[field.name]}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder || ''}
                style={{ 
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: 'white',
                  color: '#374151',
                  resize: 'vertical',
                  minHeight: '60px',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease',
                  outline: 'none'
                }}
                rows={field.rows || 3}
                onFocus={(e) => {
                  e.target.style.borderColor = color;
                  e.target.style.boxShadow = `0 0 0 3px ${color}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ) : (
              <input
                type={field.type || 'text'}
                value={fieldValues[field.name]}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                placeholder={field.placeholder || ''}
                style={{ 
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px',
                  background: 'white',
                  color: '#374151',
                  transition: 'all 0.15s ease',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = color;
                  e.target.style.boxShadow = `0 0 0 3px ${color}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};