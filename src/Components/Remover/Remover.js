import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFileDownload } from "react-icons/fa";
import "./Remover.css";
import { fabric } from "fabric";
const Remover = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [finalUrl, setFinalUrl] = useState(null);
  const [isUpload, setIsUpload] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isMagicBrushMode, setIsMagicBrushMode] = useState(false);
  const [canvas, setCanvas] = useState(null);
  const [brushSize, setBrushSize] = useState(10);
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const handleFileUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event) => {
      let image = event.target.files?.[0];
      if (image) {
        setSelectedFile(image);
        const url = URL.createObjectURL(image);
        setPreviewUrl(url);
        navigate("/preview");
      }
    };
    fileInput.click();
  };

  const handleRemoveBackground = async () => {
    setIsUpload(true);
    const formData = new FormData();
    if (selectedFile) {
      formData.append("image_file", selectedFile);
    }
    formData.append("size", "auto");

    const api_key = "J1N9kA14wUy2ikkTmDnGoDCo";
    try {
      const response = await axios.post(
        "https://api.remove.bg/v1.0/removebg",
        formData,
        {
          headers: {
            "X-Api-Key": api_key,
          },
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(response.data);
      setFinalUrl(url);
    } catch (error) {
      console.error("Error removing background:", error);
    } finally {
      setIsUpload(false);
    }
  };

  useEffect(() => {
    let newCanvas;
    if (isMagicBrushMode && canvasRef.current) {
      newCanvas = new fabric.Canvas(canvasRef.current, {
        width: 1700,
        height: 1200,
      });
      setCanvas(newCanvas);
      fabric.Image.fromURL(previewUrl, (img) => {
        img.set({
          left: newCanvas.width / 2,
          top: newCanvas.height / 2,
          originX: "center",
          originY: "center",
          selectable: false,
        });
        newCanvas.setBackgroundImage(img, newCanvas.renderAll.bind(newCanvas));
      });
      newCanvas.freeDrawingBrush.color = "rgba(217,0,0,1)";
      newCanvas.freeDrawingBrush.width = brushSize;
      newCanvas.isDrawingMode = true;
      return () => {
        if (newCanvas && !isMagicBrushMode) {
          newCanvas.dispose();
          setCanvas(null);
        }
      };
    }
  }, [isMagicBrushMode, previewUrl, brushSize]);
  const handleBrushSizeChange = (e) => {
    const size = parseInt(e.target.value);
    setBrushSize(size);
    if (canvas) {
      canvas.freeDrawingBrush.width = size;
    }
  };

  const handleDone = async () => {
    const imageData = canvas.toDataURL({ format: "png", quality: 1 });
    const new_img = await (
      await fetch("/api/removebrush", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageData }),
      })
    ).blob();

    const new_img_url = URL.createObjectURL(new_img);
    setFinalUrl(new_img_url);
    canvas.clear();
    setIsMagicBrushMode(false);
  };
  return (
    <div className="background w-screen h-screen">
      <div className="remover_container text-slate-100 flex justify-evenly items-center flex-col w-screen h-screen md:flex-col lg:flex-col">
        {!previewUrl ? (
          <div className="flex justify-center items-center flex-col h-1/2">
            <button
              type="button"
              onClick={handleFileUpload}
              className="bg-purple-600 p-2 rounded"
            >
              Upload Image
            </button>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center h-screen">
            {isMagicBrushMode ? (
              <canvas
                ref={canvasRef}
                className="border"
                style={{ width: "800px", height: "600px" }}
              />
            ) : (
              <img
                src={previewUrl}
                alt="preview"
                className="w-2/6 h-auto"
                style={{ width: "600px", height: "auto" }}
              />
            )}
            {!isUpload && !isMagicBrushMode ? (
              <>
                <button
                  type="button"
                  onClick={handleRemoveBackground}
                  className="bg-purple-600 p-2 rounded mt-4"
                >
                  Remove Background
                </button>
                <button
                  type="button"
                  onClick={() => setIsMagicBrushMode(true)}
                  className="bg-blue-600 p-2 rounded mt-4"
                >
                  Magic Brush
                </button>
              </>
            ) : isMagicBrushMode ? (
              <div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={brushSize}
                  onChange={handleBrushSizeChange}
                />
                <button
                  type="button"
                  onClick={handleDone}
                  className="bg-green-600 p-2 rounded mt-4"
                >
                  Done
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="bg-purple-300 p-2 rounded mt-4"
                disabled={true}
              >
                Removing Background...
              </button>
            )}
          </div>
        )}
        {finalUrl && (
          <div className="flex justify-center items-center flex-col mt-8 p-4">
            <div className="final_img_area w-fit grid place-items-center">
              <img
                src={finalUrl}
                alt="final_img"
                className="w-2/6 h-auto"
                style={{ width: "600px", height: "auto" }}
              />
            </div>
            <a href={finalUrl} download="Removed Background.png">
              <button className="bg-purple-600 p-2 rounded flex items-center m-1 w-full">
                Download{" "}
                <div className="px-2">
                  <FaFileDownload />
                </div>
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Remover;
