import React, { useState } from "react";
import { assets } from "../assets/assets";

const ImageUpload = () => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
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
      {image && <img src={image} alt="Preview" width="50px" />}
    </label>
  );
};

export default ImageUpload;
