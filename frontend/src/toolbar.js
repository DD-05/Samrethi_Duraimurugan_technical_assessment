// toolbar.js
import { DraggableNode } from './draggableNode';
import { ToolbarControls } from './toolbarControls';

export const PipelineToolbar = () => {
    return (
        <>
            {/* Undo/Redo/Delete Controls */}
            <div style={{ margin: '24px 24px 0' }}>
                <ToolbarControls />
            </div>

            {/* Node Palette */}
            <div style={{ 
            margin: '24px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px'
            }}>
                <div style={{
                    width: '4px',
                    height: '24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '2px'
                }} />
                <h2 style={{ 
                    margin: 0, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontSize: '20px',
                    fontWeight: '700',
                    letterSpacing: '-0.3px'
                }}>
                    Node Toolkit
                </h2>
                <div style={{
                    marginLeft: 'auto',
                    padding: '6px 12px',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#667eea'
                }}>
                    9 Nodes Available
                </div>
            </div>

            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '20px'
            }}>
                {/* Core Nodes Section */}
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px'
                    }}>
                        <span style={{
                            fontSize: '24px',
                            filter: 'grayscale(0.3)'
                        }}>🎯</span>
                        <h4 style={{ 
                            margin: 0, 
                            color: '#374151', 
                            fontSize: '15px',
                            fontWeight: '600'
                        }}>
                            Core Nodes
                        </h4>
                    </div>
                    <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '12px'
                    }}>
                        <DraggableNode type='customInput' label='Input' />
                        <DraggableNode type='llm' label='LLM' />
                        <DraggableNode type='customOutput' label='Output' />
                        <DraggableNode type='text' label='Text' />
                    </div>
                </div>

                {/* Processing Nodes Section */}
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px'
                    }}>
                        <span style={{
                            fontSize: '24px',
                            filter: 'grayscale(0.3)'
                        }}>⚙️</span>
                        <h4 style={{ 
                            margin: 0, 
                            color: '#374151', 
                            fontSize: '15px',
                            fontWeight: '600'
                        }}>
                            Processing Nodes
                        </h4>
                    </div>
                    <div style={{ 
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                        gap: '12px'
                    }}>
                        <DraggableNode type='filter' label='Filter' />
                        <DraggableNode type='math' label='Math' />
                        <DraggableNode type='timer' label='Timer' />
                        <DraggableNode type='api' label='API' />
                        <DraggableNode type='condition' label='Condition' />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
        </>
    );
};