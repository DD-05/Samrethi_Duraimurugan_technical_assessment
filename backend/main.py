from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
from collections import defaultdict, deque

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PipelineRequest(BaseModel):
    pipeline: str

def is_dag(nodes, edges):
    """Check if the graph formed by nodes and edges is a Directed Acyclic Graph (DAG)"""
    # Build adjacency list
    graph = defaultdict(list)
    in_degree = defaultdict(int)
    
    # Initialize all nodes with 0 in-degree
    for node in nodes:
        in_degree[node['id']] = 0
    
    # Build graph and calculate in-degrees
    for edge in edges:
        source = edge['source']
        target = edge['target']
        graph[source].append(target)
        in_degree[target] += 1
    
    # Kahn's algorithm for topological sorting
    queue = deque([node for node in in_degree if in_degree[node] == 0])
    processed = 0
    
    while queue:
        node = queue.popleft()
        processed += 1
        
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If all nodes are processed, it's a DAG
    return processed == len(nodes)

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(request: PipelineRequest):
    try:
        pipeline_data = json.loads(request.pipeline)
        nodes = pipeline_data.get('nodes', [])
        edges = pipeline_data.get('edges', [])
        
        # Basic validation
        if not nodes:
            raise HTTPException(status_code=400, detail="Pipeline must contain at least one node")
        
        # Check if it's a DAG
        is_dag_result = is_dag(nodes, edges)
        
        return {
            'num_nodes': len(nodes),
            'num_edges': len(edges),
            'is_dag': is_dag_result
        }
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in pipeline data")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing pipeline: {str(e)}")
