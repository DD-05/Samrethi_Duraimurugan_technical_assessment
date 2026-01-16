// store.js
import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
} from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
    nodeIDs: {},
    history: [],
    historyIndex: -1,
    maxHistorySize: 50,

    // Save state to history
    saveToHistory: () => {
        const { nodes, edges, history, historyIndex, maxHistorySize } = get();
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges))
        });

        // Limit history size
        if (newHistory.length > maxHistorySize) {
            newHistory.shift();
        }

        set({
            history: newHistory,
            historyIndex: newHistory.length - 1
        });
    },

    // Undo action
    undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            const previousState = history[newIndex];
            set({
                nodes: JSON.parse(JSON.stringify(previousState.nodes)),
                edges: JSON.parse(JSON.stringify(previousState.edges)),
                historyIndex: newIndex
            });
        }
    },

    // Redo action
    redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            const nextState = history[newIndex];
            set({
                nodes: JSON.parse(JSON.stringify(nextState.nodes)),
                edges: JSON.parse(JSON.stringify(nextState.edges)),
                historyIndex: newIndex
            });
        }
    },

    // Delete selected nodes and their connected edges
    deleteSelectedNodes: () => {
        const { nodes, edges } = get();
        const selectedNodes = nodes.filter(node => node.selected);
        
        if (selectedNodes.length === 0) return;

        const selectedNodeIds = new Set(selectedNodes.map(node => node.id));
        
        // Filter out selected nodes
        const newNodes = nodes.filter(node => !selectedNodeIds.has(node.id));
        
        // Filter out edges connected to deleted nodes
        const newEdges = edges.filter(edge => 
            !selectedNodeIds.has(edge.source) && !selectedNodeIds.has(edge.target)
        );

        set({
            nodes: newNodes,
            edges: newEdges
        });

        // Save to history after deletion
        setTimeout(() => get().saveToHistory(), 0);
    },

    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },

    addNode: (node) => {
        set({
            nodes: [...get().nodes, node]
        });
        // Save to history after adding node
        setTimeout(() => get().saveToHistory(), 0);
    },

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
        
        // Save to history only for specific change types
        const shouldSaveHistory = changes.some(change => 
            change.type === 'remove' || 
            (change.type === 'position' && change.dragging === false)
        );
        
        if (shouldSaveHistory) {
            setTimeout(() => get().saveToHistory(), 0);
        }
    },

    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
        
        // Save to history for edge removal
        const shouldSaveHistory = changes.some(change => change.type === 'remove');
        if (shouldSaveHistory) {
            setTimeout(() => get().saveToHistory(), 0);
        }
    },

    onConnect: (connection) => {
        set({
            edges: addEdge({
                ...connection, 
                type: 'smoothstep', 
                animated: true, 
                markerEnd: {
                    type: MarkerType.Arrow, 
                    height: '20px', 
                    width: '20px'
                }
            }, get().edges),
        });
        // Save to history after connecting
        setTimeout(() => get().saveToHistory(), 0);
    },

    updateNodeField: (nodeId, fieldName, fieldValue) => {
        set({
            nodes: get().nodes.map((node) => {
                if (node.id === nodeId) {
                    node.data = { ...node.data, [fieldName]: fieldValue };
                }
                return node;
            }),
        });
        // Debounce history save for field updates
        clearTimeout(get().fieldUpdateTimeout);
        const timeout = setTimeout(() => get().saveToHistory(), 500);
        set({ fieldUpdateTimeout: timeout });
    },

    fieldUpdateTimeout: null,

    // Initialize history with empty state
    initializeHistory: () => {
        const { nodes, edges } = get();
        set({
            history: [{
                nodes: JSON.parse(JSON.stringify(nodes)),
                edges: JSON.parse(JSON.stringify(edges))
            }],
            historyIndex: 0
        });
    },

    // Check if undo/redo is available
    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,
}));