import React from 'react';

interface VisualizationProps {
  clientCanvasRef: React.RefObject<HTMLCanvasElement>;
  serverCanvasRef: React.RefObject<HTMLCanvasElement>;
}

const Visualization: React.FC<VisualizationProps> = ({
  clientCanvasRef,
  serverCanvasRef,
}) => {
  return (
    <div className="visualization">
      <div className="visualization-entry client">
        <canvas ref={clientCanvasRef} />
      </div>
      <div className="visualization-entry server">
        <canvas ref={serverCanvasRef} />
      </div>
    </div>
  );
};

export default Visualization;
