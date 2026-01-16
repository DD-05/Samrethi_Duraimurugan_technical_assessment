# VectorShift Technical Assessment - Pipeline Builder

A full-stack drag-and-drop pipeline builder for creating AI workflows with React Flow frontend and FastAPI backend.

## 🎯 Features Implemented

### Part 1: Node Abstraction ✅
- **BaseNode component** - Reusable abstraction eliminating code duplication
- **9 node types**: Input, Output, LLM, Text, Filter, Math, Timer, API, Condition
- **Easy extensibility** - Create new nodes with simple configuration objects

### Part 2: Styling ✅
- **Professional UI** with unified color scheme
- **Color-coded nodes** for visual organization
- **Hover effects** and smooth animations
- **Responsive design** with proper spacing and shadows

### Part 3: Text Node Logic ✅
- **Dynamic sizing** - Width/height adjust based on content
- **Variable detection** - Detects `{{variableName}}` patterns
- **Auto-generated handles** - Creates input handles for each variable
- **Bonus feature** - "Create Inputs" button to auto-generate Input nodes

### Part 4: Backend Integration ✅
- **Pipeline submission** - Sends nodes/edges to backend
- **DAG detection** - Kahn's algorithm for cycle detection
- **User-friendly alerts** - Displays node count, edge count, and DAG status
- **CORS support** - Seamless frontend-backend communication

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will run on:** http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

**Frontend will run on:** http://localhost:3000

## 📖 Usage Guide

### Creating a Pipeline

1. **Drag nodes** from the toolbar to the canvas
2. **Configure nodes** by editing their properties
3. **Connect nodes** by dragging from output handles to input handles
4. **Submit pipeline** to analyze structure and validate DAG

### Text Node Variables

1. Type text with variables: `Hello {{name}}, you are {{age}} years old`
2. See detected variables displayed below the title
3. Blue handles appear on the left for each variable
4. Click "Create Inputs" to auto-generate Input nodes

### Testing DAG Detection

**Valid DAG:**
- Input → Text → LLM → Output
- Result: "Is Valid DAG: Yes"

**Cycle (Invalid):**
- Text1 → Text2 → Text1
- Result: "Is Valid DAG: No"

## 🏗️ Architecture

### Frontend
- **React** with React Flow for visual pipeline builder
- **Zustand** for state management
- **Component abstraction** for maintainable node system

### Backend
- **FastAPI** for REST API
- **Kahn's algorithm** for DAG detection
- **Pydantic** for request validation

### API Endpoints

- `GET /` - Health check
- `POST /pipelines/parse` - Parse and validate pipeline
  - Request: `{pipeline: string}`
  - Response: `{num_nodes: int, num_edges: int, is_dag: bool}`

## 📁 Project Structure

```
Samrethi_Duraimurugan_technical_assessment/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── nodes/          # Node components
│   │   ├── baseNode.js     # Node abstraction
│   │   ├── App.js          # Main application
│   │   ├── store.js        # Zustand state
│   │   ├── ui.js           # ReactFlow canvas
│   │   ├── toolbar.js      # Node toolbar
│   │   └── submit.js       # Submit button
│   └── package.json        # Node dependencies
└── README.md               # This file
```

## 🎨 Node Types

### Core Nodes
- **Input** (Blue) - Data input with name and type
- **Output** (Green) - Data output with name and type
- **LLM** (Orange) - Language model with system/prompt inputs
- **Text** (Purple) - Text with variable detection

### Processing Nodes
- **Filter** (Light Orange) - Conditional filtering
- **Math** (Teal) - Mathematical operations
- **Timer** (Red) - Delay operations
- **API** (Light Green) - API calls
- **Condition** (Light Purple) - Conditional branching

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend servers
2. Create a simple pipeline: Input → Text → Output
3. Add variables to Text node: `{{name}} and {{age}}`
4. Connect nodes and submit
5. Verify alert shows correct counts and DAG status

### Cycle Detection Test
1. Create two Text nodes
2. Connect: Text1 → Text2 → Text1
3. Submit and verify "Is Valid DAG: No"

## 🛠️ Technologies Used

- **Frontend**: React, React Flow, Zustand
- **Backend**: Python, FastAPI, Uvicorn
- **Styling**: Inline CSS with modern design principles
- **State Management**: Zustand
- **API Communication**: Fetch API with CORS

## 👤 Author

Samrethi Duraimurugan

## 📝 License

This project was created as part of the VectorShift technical assessment.

## 🙏 Acknowledgments

- VectorShift for the assessment opportunity
- React Flow for the excellent graph visualization library