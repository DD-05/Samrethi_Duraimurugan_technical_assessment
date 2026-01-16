// submit.js
import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
    const { nodes, edges } = useStore();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setIsLoading(true);
        
        try {
            const pipeline = { nodes, edges };
            
            // Call backend API
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pipeline: JSON.stringify(pipeline)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            // Create custom alert modal
            showCustomAlert(result);
            
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            
            // Fallback to client-side calculation if backend is unavailable
            const result = calculateClientSide(nodes, edges);
            showCustomAlert(result, true);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateClientSide = (nodes, edges) => {
        const isDAG = (nodes, edges) => {
            const graph = {};
            const inDegree = {};
            
            nodes.forEach(node => {
                graph[node.id] = [];
                inDegree[node.id] = 0;
            });
            
            edges.forEach(edge => {
                graph[edge.source].push(edge.target);
                inDegree[edge.target]++;
            });
            
            const queue = [];
            Object.keys(inDegree).forEach(node => {
                if (inDegree[node] === 0) queue.push(node);
            });
            
            let processed = 0;
            while (queue.length > 0) {
                const node = queue.shift();
                processed++;
                
                graph[node].forEach(neighbor => {
                    inDegree[neighbor]--;
                    if (inDegree[neighbor] === 0) {
                        queue.push(neighbor);
                    }
                });
            }
            
            return processed === nodes.length;
        };
        
        return {
            num_nodes: nodes.length,
            num_edges: edges.length,
            is_dag: isDAG(nodes, edges)
        };
    };

    const showCustomAlert = (result, isOffline = false) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.2s ease;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 32px;
            max-width: 480px;
            width: 90%;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
            position: relative;
        `;

        const statusIcon = result.is_dag ? '✅' : '⚠️';
        const statusColor = result.is_dag ? '#48bb78' : '#f56565';
        const statusText = result.is_dag ? 'Valid DAG' : 'Not a DAG';

        content.innerHTML = `
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes shimmer {
                    0% { background-position: -100% 0; }
                    100% { background-position: 200% 0; }
                }
            </style>
            
            ${isOffline ? `
                <div style="
                    background: linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(237, 137, 54, 0.1) 100%);
                    border: 1px solid rgba(245, 101, 101, 0.3);
                    border-radius: 12px;
                    padding: 12px;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                ">
                    <span style="font-size: 20px;">⚡</span>
                    <div style="font-size: 13px; color: #c53030; font-weight: 600;">
                        Backend offline - Using client-side validation
                    </div>
                </div>
            ` : ''}
            
            <div style="text-align: center; margin-bottom: 24px;">
                <div style="
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 16px;
                    background: linear-gradient(135deg, ${statusColor}20 0%, ${statusColor}10 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    animation: slideUp 0.4s ease 0.1s both;
                ">
                    ${statusIcon}
                </div>
                <h2 style="
                    margin: 0 0 8px;
                    font-size: 24px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                ">
                    Pipeline Analysis
                </h2>
                <p style="
                    margin: 0;
                    color: #6b7280;
                    font-size: 14px;
                ">
                    Here's what we found
                </p>
            </div>

            <div style="
                background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 24px;
            ">
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="
                                width: 40px;
                                height: 40px;
                                background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 18px;
                            ">📦</div>
                            <span style="color: #374151; font-weight: 600;">Total Nodes</span>
                        </div>
                        <span style="
                            font-size: 28px;
                            font-weight: 700;
                            background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            background-clip: text;
                        ">${result.num_nodes}</span>
                    </div>

                    <div style="height: 1px; background: linear-gradient(90deg, transparent, #e5e7eb, transparent);"></div>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="
                                width: 40px;
                                height: 40px;
                                background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%);
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 18px;
                            ">🔗</div>
                            <span style="color: #374151; font-weight: 600;">Total Edges</span>
                        </div>
                        <span style="
                            font-size: 28px;
                            font-weight: 700;
                            background: linear-gradient(135deg, #9f7aea 0%, #805ad5 100%);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            background-clip: text;
                        ">${result.num_edges}</span>
                    </div>

                    <div style="height: 1px; background: linear-gradient(90deg, transparent, #e5e7eb, transparent);"></div>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="
                                width: 40px;
                                height: 40px;
                                background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%);
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 18px;
                            ">${statusIcon}</div>
                            <span style="color: #374151; font-weight: 600;">DAG Status</span>
                        </div>
                        <span style="
                            padding: 8px 16px;
                            background: linear-gradient(135deg, ${statusColor}20 0%, ${statusColor}10 100%);
                            color: ${statusColor};
                            border-radius: 8px;
                            font-weight: 700;
                            font-size: 14px;
                        ">${statusText}</span>
                    </div>
                </div>
            </div>

            ${!result.is_dag ? `
                <div style="
                    background: linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(237, 137, 54, 0.1) 100%);
                    border: 1px solid rgba(245, 101, 101, 0.3);
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 24px;
                ">
                    <div style="display: flex; gap: 12px; align-items: start;">
                        <span style="font-size: 20px;">💡</span>
                        <div>
                            <div style="font-weight: 600; color: #c53030; margin-bottom: 4px;">
                                Cycle Detected
                            </div>
                            <div style="font-size: 13px; color: #742a2a; line-height: 1.5;">
                                Your pipeline contains a circular dependency. Please ensure all connections flow in one direction without loops.
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}

            <button id="closeModal" style="
                width: 100%;
                padding: 14px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s ease;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(102, 126, 234, 0.3)';">
                Got it!
            </button>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        const closeButton = content.querySelector('#closeModal');
        const closeModal = () => {
            modal.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => modal.remove(), 200);
        };

        closeButton.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    };

    return (
        <div style={{
            padding: '24px',
            background: 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderTop: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            animation: 'fadeIn 0.7s ease-out 0.2s both'
        }}>
            <button 
                type="button" 
                onClick={handleSubmit}
                disabled={isLoading || nodes.length === 0}
                style={{
                    position: 'relative',
                    background: nodes.length === 0 
                        ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: '200% 200%',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '14px 32px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: nodes.length === 0 ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    opacity: nodes.length === 0 ? 0.6 : 1,
                    overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                    if (nodes.length > 0 && !isLoading) {
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.4)';
                        e.currentTarget.style.backgroundPosition = '100% 50%';
                    }
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
                    e.currentTarget.style.backgroundPosition = '0% 50%';
                }}
            >
                {isLoading ? (
                    <>
                        <div style={{
                            width: '18px',
                            height: '18px',
                            border: '3px solid rgba(255, 255, 255, 0.3)',
                            borderTop: '3px solid white',
                            borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite'
                        }} />
                        <span>Analyzing...</span>
                    </>
                ) : (
                    <>
                        <span style={{fontSize: '20px'}}>🚀</span>
                        <span>Submit Pipeline</span>
                    </>
                )}
            </button>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};