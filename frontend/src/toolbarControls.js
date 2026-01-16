// toolbarControls.js
import { useStore } from './store';
import { useEffect } from 'react';

export const ToolbarControls = () => {
    const { undo, redo, deleteSelectedNodes, canUndo, canRedo } = useStore();

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Undo: Ctrl+Z or Cmd+Z
            if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
                event.preventDefault();
                if (canUndo()) {
                    undo();
                }
            }
            
            // Redo: Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y
            if (((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z') ||
                ((event.ctrlKey || event.metaKey) && event.key === 'y')) {
                event.preventDefault();
                if (canRedo()) {
                    redo();
                }
            }
            
            // Delete: Delete or Backspace
            if (event.key === 'Delete' || event.key === 'Backspace') {
                // Only if not typing in an input
                if (!['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
                    event.preventDefault();
                    deleteSelectedNodes();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, deleteSelectedNodes, canUndo, canRedo]);

    const buttonStyle = (disabled) => ({
        padding: '10px 16px',
        background: disabled 
            ? 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)'
            : 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '600',
        color: disabled ? '#9ca3af' : '#374151',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: disabled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.05)',
        opacity: disabled ? 0.5 : 1
    });

    const iconStyle = {
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center'
    };

    return (
        <div style={{
            display: 'flex',
            gap: '8px',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            marginBottom: '16px'
        }}>
            {/* Undo Button */}
            <button
                onClick={undo}
                disabled={!canUndo()}
                style={buttonStyle(!canUndo())}
                onMouseEnter={(e) => {
                    if (canUndo()) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = canUndo() ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none';
                    e.currentTarget.style.background = canUndo() ? 'white' : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
                }}
                title="Undo (Ctrl+Z)"
            >
                <span style={iconStyle}>↶</span>
                <span>Undo</span>
                <kbd style={{
                    padding: '2px 6px',
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb'
                }}>
                    {navigator.platform.includes('Mac') ? '⌘Z' : 'Ctrl+Z'}
                </kbd>
            </button>

            {/* Redo Button */}
            <button
                onClick={redo}
                disabled={!canRedo()}
                style={buttonStyle(!canRedo())}
                onMouseEnter={(e) => {
                    if (canRedo()) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = canRedo() ? '0 2px 4px rgba(0, 0, 0, 0.05)' : 'none';
                    e.currentTarget.style.background = canRedo() ? 'white' : 'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
                }}
                title="Redo (Ctrl+Shift+Z)"
            >
                <span style={iconStyle}>↷</span>
                <span>Redo</span>
                <kbd style={{
                    padding: '2px 6px',
                    background: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#6b7280',
                    border: '1px solid #e5e7eb'
                }}>
                    {navigator.platform.includes('Mac') ? '⌘⇧Z' : 'Ctrl+Y'}
                </kbd>
            </button>

            {/* Divider */}
            <div style={{
                width: '1px',
                background: 'linear-gradient(to bottom, transparent, #e5e7eb, transparent)',
                margin: '0 4px'
            }} />

            {/* Delete Button */}
            <button
                onClick={deleteSelectedNodes}
                style={{
                    ...buttonStyle(false),
                    background: 'white',
                    color: '#f56565',
                    borderColor: '#fed7d7'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 101, 101, 0.2)';
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.background = 'white';
                }}
                title="Delete Selected (Del)"
            >
                <span style={iconStyle}>🗑️</span>
                <span>Delete</span>
                <kbd style={{
                    padding: '2px 6px',
                    background: '#fff5f5',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    color: '#f56565',
                    border: '1px solid #fed7d7'
                }}>
                    Del
                </kbd>
            </button>

            {/* Shortcut Help */}
            <div style={{
                marginLeft: 'auto',
                padding: '10px 16px',
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#667eea',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                <span style={{ fontSize: '14px' }}>⌨️</span>
                <span>Keyboard shortcuts enabled</span>
            </div>
        </div>
    );
};