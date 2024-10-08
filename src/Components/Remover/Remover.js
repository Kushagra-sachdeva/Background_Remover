import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import './Remover.css'; 
import { FaFileDownload } from "react-icons/fa";

const Remover = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isDone, setIsDone] = useState(false); 

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, { isDrawingMode: false });
    setCanvas(fabricCanvas);

    fabricCanvas.setBackgroundImage('usable.png', fabricCanvas.renderAll.bind(fabricCanvas));
    fabricCanvas.freeDrawingBrush.color = 'white';
    fabricCanvas.freeDrawingBrush.width = 50;

    fabricCanvas.on('selection:created', () => {
      const removeButton = document.getElementById('remove');
      if (removeButton) {
        removeButton.disabled = false;
      }
    });

    fabricCanvas.on('selection:cleared', () => {
      const removeButton = document.getElementById('remove');
      if (removeButton) {
        removeButton.disabled = true;
      }
    });

    return () => {
      fabricCanvas.dispose();
    };
  }, []);

  const handleMagicBrush = () => {
    if (canvas) {
      const newDrawingMode = !canvas.isDrawingMode;
      canvas.isDrawingMode = newDrawingMode;
      setIsDrawingMode(newDrawingMode);
      setIsDone(newDrawingMode); 
    }
  };

  const handleRemove = () => {
    if (canvas) {
      canvas.isDrawingMode = false;
      canvas.remove(canvas.getActiveObject());
    }
  };

  const handleDone = () => {
    setIsDrawingMode(false);
    setIsDone(false);
    handleApiClick(); 
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (f) => {
      const data = f.target.result;
      fabric.Image.fromURL(data, (img) => {
        canvas.setWidth(img.width);
        canvas.setHeight(img.height);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
        });
      });
    };

    reader.readAsDataURL(file);
  };

  const removeBgFromImage = (imageData) => {
    const apiKey = 'J1N9kA14wUy2ikkTmDnGoDCo'; 
    const base64Data = imageData.split(',')[1];

    fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify({ image_file_b64: base64Data }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        setResultImage(blob);
        const imageUrl = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(imageUrl);
          const resultImageDiv = document.getElementById('result-image');
          if (resultImageDiv) {
            resultImageDiv.innerHTML = '';
            resultImageDiv.appendChild(img);
          }
        };
        img.src = imageUrl;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleApiClick = () => {
    if (canvas) {
      const imageData = canvas.toDataURL({
        format: 'png',
        quality: 1,
      });
      removeBgFromImage(imageData);
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const downloadableBlob = new Blob([resultImage], { type: 'image/png' });
      const downloadableUrl = URL.createObjectURL(downloadableBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = downloadableUrl;
      downloadLink.download = 'result-image.png';
      downloadLink.click();
      URL.revokeObjectURL(downloadableUrl);
    } else {
      alert('No result image to download. Please process an image first.');
    }
  };

  const triggerFileInput = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div className="image-remover-container">
      <div className="canvas-wrapper">
        <canvas id="canvas" ref={canvasRef} width={800} height={600} />
      </div>
      <div className="button-container" style={{ display: 'flex', alignItems: 'center' }}>
        {!isDrawingMode && (
          <>
            <button onClick={triggerFileInput}>Upload Image</button>
            <input type="file" id="file-input" style={{ display: 'none' }} onChange={handleFileChange} />
            <button onClick={handleApiClick}>Remove Background</button>
          </>
        )}
        <button onClick={handleMagicBrush}>Magic Brush</button>
        {isDrawingMode && (
          <>
            <button id="remove" onClick={handleRemove}>Remove</button>
            <button onClick={handleDone}>Done</button> 
          </>
        )}
        <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center' }}>
          Download
          <div className="px-2" style={{ marginLeft: 'auto' }}>
            <FaFileDownload />
          </div>
        </button>
      </div>
      <div id="result-image"></div>
    </div>
  );
}

export default Remover;
