import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaParagraph, FaImage, FaHeading, FaPlusSquare } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import { MdPhoneAndroid } from 'react-icons/md';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { FiTrash2 } from "react-icons/fi"; // Import icons

const App = () => {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [previewContent, setPreviewContent] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isMobileView, setIsMobileView] = useState(false);
  const [selectedTab, setSelectedTab] = useState('editor'); // New state to track selected tab
  const [selectedLayout, setSelectedLayout] = useState(null); // Track selected layout
  const dragIndex = useRef(null);

  const addText = () => {
    setPreviewContent([
      ...previewContent,
      { type: 'para', content: 'Paragraph', style: { fontSize: '16px', textAlign: 'center', color: '#000000', padding: '10px 5px' } },
    ]);
  };

  const addHeading = () => {
    setPreviewContent([
      ...previewContent,
      { type: 'head', content: 'Heading', style: { fontSize: '25px', textAlign: 'center', color: '#000000', padding: '10px 5px', fontWeight: 'bold' } },
    ]);
  };

  const addImage = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const imageUrl = response.data.imageUrl;
        setPreviewContent([
          ...previewContent,
          { type: 'image', src: imageUrl, style: { width: '100%', height: 'auto', textAlign: 'center' } },
        ]);
      } catch (err) {
        toast.error('Image upload failed');
      }
    };
    fileInput.click();
  };

  const addButton = () => {
    setPreviewContent([
      ...previewContent,
      {
        type: 'button',
        content: 'Click Me',
        style: { textAlign: 'center', padding: '10px 20px', backgroundColor: 'black', color: '#ffffff', border: 'none', borderRadius: '5px' },
        link: "https://www.google.com/",
      },
    ]);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab); // Switch between 'editor' and 'layout'
  };

  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout); // Set selected layout
  };

  const handleDragStart = (index) => {
    dragIndex.current = index;
  };

  const handleDrop = (dropIndex) => {
    if (dragIndex.current !== null) {
      const tempContent = [...previewContent];
      const [draggedItem] = tempContent.splice(dragIndex.current, 1);
      tempContent.splice(dropIndex, 0, draggedItem);
      setPreviewContent(tempContent);
      dragIndex.current = null;
    }
  };

  const handleEditorDrop = (e) => {
    e.preventDefault();
    const type = dragIndex.current;
    if (type === 'para') addText();
    else if (type === 'head') addHeading();
    else if (type === 'image') addImage();
    else if (type === 'button') addButton();
    dragIndex.current = null; // Reset the type after drop
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop by preventing default
  };

  return (
    <div>
      <nav className="navbar">
        <div><h3>Template Builder</h3></div>
        <div>
          <button onClick={() => setIsMobileView(false)} className="navbar-button">Desktop</button>
          <button onClick={() => setIsMobileView(true)} className="navbar-button">Mobile</button>
          <button onClick={() => setModalOpen(true)} className="navbar-button">Test Mail</button>
        </div>
      </nav>
      <div className="app-container">
        {/* Tab Navigation */}
        <div className="tabs">
          <button onClick={() => handleTabChange('editor')} className={selectedTab === 'editor' ? 'active' : ''}>Editor</button>
          <button onClick={() => handleTabChange('layout')} className={selectedTab === 'layout' ? 'active' : ''}>Layout</button>
        </div>

        {/* Editor Section */}
        {selectedTab === 'editor' && (
          <div className="editor">
            <div className="edit-btn">
              <button onClick={addHeading} className="editor-button" draggable onDragStart={(e) => handleDragStart('head')}><FaHeading /> Heading</button>
              <button onClick={addText} className="editor-button" draggable onDragStart={(e) => handleDragStart('para')}><FaParagraph /> Paragraph</button>
              <button onClick={addImage} className="editor-button" draggable onDragStart={(e) => handleDragStart('image')}><FaImage /> Image</button>
              <button onClick={addButton} className="editor-button" draggable onDragStart={(e) => handleDragStart('button')}><FaPlusSquare /> Button</button>
            </div>
          </div>
        )}

        {/* Layout Section */}
        {selectedTab === 'layout' && (
          <div className="layout">
            <div>
              <button onClick={() => handleLayoutSelect('layout1')} className={selectedLayout === 'layout1' ? 'active' : ''}>Layout 1</button>
              <button onClick={() => handleLayoutSelect('layout2')} className={selectedLayout === 'layout2' ? 'active' : ''}>Layout 2</button>
              <button onClick={() => handleLayoutSelect('layout3')} className={selectedLayout === 'layout3' ? 'active' : ''}>Layout 3</button>
            </div>
            <div className="preview">
              {selectedLayout === 'layout1' && (
                <div className="layout1">
                  <div className="layout-item" onDrop={handleEditorDrop} onDragOver={handleDragOver}>
                    Drop content here (Layout 1)
                  </div>
                </div>
              )}
              {selectedLayout === 'layout2' && (
                <div className="layout2">
                  <div className="layout-item" onDrop={handleEditorDrop} onDragOver={handleDragOver}>
                    Drop content here (Layout 2)
                  </div>
                  <div className="layout-item" onDrop={handleEditorDrop} onDragOver={handleDragOver}>
                    Drop content here (Layout 2)
                  </div>
                </div>
              )}
              {selectedLayout === 'layout3' && (
                <div className="layout3">
                  <div className="layout-item" onDrop={handleEditorDrop} onDragOver={handleDragOver}>
                    Drop content here (Layout 3)
                  </div>
                  <div className="layout-item" onDrop={handleEditorDrop} onDragOver={handleDragOver}>
                    Drop content here (Layout 3)
                  </div>
                  <div className="layout-item" onDrop={handleEditorDrop} onDragOver={handleDragOver}>
                    Drop content here (Layout 3)
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
