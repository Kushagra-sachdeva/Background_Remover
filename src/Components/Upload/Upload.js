import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const Upload = () => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [fileError, setFileError] = useState({ type: false, size: false });
  const [fileSelected, setFileSelected] = useState(false);
  const [imageData, setImageData] = useState(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange({ target: { files } });
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const file = files[0];
      setFileSelected(true);
      validateFile(file);
    }
  };

  const validateFile = (file) => {
    const fileTypes = ["image/png", "image/jpg", "image/jpeg"];
    const fileSize = file.size / (1024 * 1024);
    let newFileError = { type: false, size: false };

    if (!fileTypes.includes(file.type)) {
      newFileError.type = true;
    }
    if (fileSize > 5) {
      newFileError.size = true;
    }

    setFileError(newFileError);
    if (!newFileError.type && !newFileError.size) {
      uploadFile(file);
    }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("main-image", file);
    const upload_res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    }).then((res) => res.text());

   
    setImageData(upload_res);
    navigate("/remove", { state: { imageData: upload_res } });
  };
};
export default Upload;