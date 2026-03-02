import React, { useState } from "react";
import { aboutApi } from "../../api/aboutApi";

const CreateAbout = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // ⚠️ Backend property adları ilə eyni olmalıdır
    formData.append("Title", title);
    formData.append("Description", description);

    if (imageFile) {
      formData.append("ImageUrl", imageFile); // ⚠️ DÜZGÜN AD
    }

    try {
      await aboutApi.create(formData);
      alert("About created successfully!");
    } catch (error) {
      console.error(error);
      alert("Error creating about");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files[0])}
      />

      <button type="submit">Create</button>
    </form>
  );
};

export default CreateAbout;
