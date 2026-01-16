import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 15s ease infinite',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Hero Header with Glassmorphism */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '24px 32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated Background Orbs */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        
        <div style={{
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '8px'
          }}>
            {/* Logo Icon */}
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
              fontSize: '24px'
            }}>
              ⚡
            </div>
            
            <div>
              <h1 style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: '800',
                color: 'white',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                letterSpacing: '-0.5px'
              }}>
                VectorShift Pipeline Builder
              </h1>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.9)',
                fontWeight: '500'
              }}>
                Create powerful AI workflows with intuitive drag-and-drop nodes
              </p>
            </div>
          </div>
        </div>
      </div>

      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

export default App;