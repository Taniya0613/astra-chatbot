import React, { useState } from "react";
import { assets } from "../assets/assets";

const ImageUpload = ({ onImageSelect }) => {
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  return (
    <label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <img
        src={assets.gallery_icon}
        alt="Gallery"
        style={{ cursor: "pointer" }}
      />
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Preview"
          width="50px"
          height="50px"
          style={{ marginLeft: "10px", borderRadius: "5px" }}
        />
      )}
    </label>
  );
};

export default ImageUpload;
