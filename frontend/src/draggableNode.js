// draggableNode.js
export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const getNodeStyle = (type) => {
      const styles = {
        customInput: {
          background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
          icon: '📥'
        },
        customOutput: {
          background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
          icon: '📤'
        },
        llm: {
          background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
          icon: '🤖'
        },
        text: {
          background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
          icon: '📝'
        },
        filter: {
          background: 'linear-gradient(135deg, #f6ad55 0%, #ed8936 100%)',
          icon: '🔍'
        },
        math: {
          background: 'linear-gradient(135deg, #38b2ac 0%, #319795 100%)',
          icon: '🔢'
        },
        timer: {
          background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
          icon: '⏱️'
        },
        api: {
          background: 'linear-gradient(135deg, #68d391 0%, #48bb78 100%)',
          icon: '🌐'
        },
        condition: {
          background: 'linear-gradient(135deg, #b794f6 0%, #9f7aea 100%)',
          icon: '🔀'
        }
      };
      return styles[type] || { 
        background: 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
        icon: '📦'
      };
    };

    const nodeStyle = getNodeStyle(type);
  
    return (
      <div
        className={type}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        style={{ 
          cursor: 'grab', 
          minWidth: '100px',
          height: '64px',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '6px',
          borderRadius: '12px',
          background: nodeStyle.background,
          backgroundSize: '200% 200%',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize: '13px',
          fontWeight: '700',
          position: 'relative',
          overflow: 'hidden'
        }} 
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
          e.currentTarget.style.backgroundPosition = '100% 50%';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.backgroundPosition = '0% 50%';
        }}
        draggable
      >
          {/* Shimmer Effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'shimmer 3s infinite'
          }} />
          
          <span style={{ 
            fontSize: '20px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }}>
            {nodeStyle.icon}
          </span>
          <span style={{ 
            color: '#fff', 
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            letterSpacing: '0.3px',
            position: 'relative',
            zIndex: 1
          }}>
            {label}
          </span>

          <style>{`
            @keyframes shimmer {
              0% { left: -100%; }
              100% { left: 200%; }
            }
          `}</style>
      </div>
    );
};