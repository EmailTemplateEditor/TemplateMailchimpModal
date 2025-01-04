import React, { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaParagraph, FaImage, FaHeading, FaPlusSquare } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import { FaDesktop } from 'react-icons/fa';
import { MdPhoneAndroid } from 'react-icons/md';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { FiTrash2 } from "react-icons/fi"; // Import icons





const App = () => {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [previewContent, setPreviewContent] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isMobileView, setIsMobileView] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({ recipient: '', subject: ''});
  const [selectedIndex, setSelectedIndex] = useState(null);  // Track selected content index
  const dragIndex = useRef(null);

  // Add new text
  const addText = () => {
    setPreviewContent([
      ...previewContent,
      { type: 'para', content: 'Paragraph', style: { fontSize: '16px', textAlign: 'center', color: '#000000',padding:'10px 5px' } },
    ]);
  };
    const addHeading = () => {
    setPreviewContent([
      ...previewContent,
      { type: 'head', content: 'Heading', style: { fontSize: '25px', textAlign: 'center', color: '#000000',padding:'10px 5px',fontWeight:'bold' } },
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

      // Upload image to Cloudinary or server
      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const imageUrl = response.data.imageUrl;
        setPreviewContent([
          ...previewContent,
          { type: 'image', src: imageUrl, style: { width: '100%', height: 'auto', textAlign: 'center'}},
        ]);
      } catch (err) {
        toast.error('Image upload failed');
      }
    };
    fileInput.click();
  };
  
  const addLogo = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      // Upload image to Cloudinary or server
      try {
        const response = await axios.post('http://localhost:5000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        const imageUrl = response.data.imageUrl;
        setPreviewContent([
          ...previewContent,
          { type: 'logo', src: imageUrl, style: { width: '100%', height: 'auto', textAlign: 'center',margin:'0 auto'}},
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
        style: {
          textAlign: 'center',
          padding: '10px 20px',
          backgroundColor: 'black',
          color: '#ffffff',
          border: 'none',
          borderRadius: '5px'
        },
        link: "https://www.google.com/",
      },
    ]);
  };

  // Handle content editing

  const updateContent = (index, newContent) => {
  const updated = [...previewContent];
  updated[index] = { ...updated[index], ...newContent };
  setPreviewContent(updated);
};

  const handleItemClick = (index) => {
    setSelectedIndex(index); // Set the selected index when an item is clicked
  };

//delete
 const deleteContent = (index) => {
   const updated = previewContent.filter((_, i) => i !== index);
   setPreviewContent(updated);
   if (selectedIndex === index) {
     setSelectedIndex(null); // Reset selection if the deleted item was selected
   } else if (selectedIndex > index) {
     setSelectedIndex(selectedIndex - 1); // Adjust index
   }
 };
   
  // // Save to DB
  // const saveToDb = () => {
  //   axios.post('http://localhost:5000/save', { previewContent, bgColor, emailData }).then(() => {
  //   console.log("saved data:",previewContent )  
  //   toast.success('Detail Saved');
  //     setModalOpen(false);
  //   });
  // };

  // Send Email
  const sendEmail = () => {
     
       if (!previewContent || previewContent.length === 0) {
         toast.warning("No previewContent available.");
         return;
       }
       if (!emailData) {
         toast.warning("Please provide a recipient email and subject");
         return;
       }
       if (!emailData.recipient) {
         toast.warning("Please provide a recipient email");
         return;
       }
       if (!emailData.subject) {
         toast.warning("Please provide a subject.");
         return;
       }
      setIsLoading(true); // Show loader
 try{
    axios.post('http://localhost:5000/send', {emailData, previewContent, bgColor})
    toast.success('Email Sent to recepient');
    setIsLoading(false); // Hide loader
    setModalOpen(false);
    }
    catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email.");
      setIsLoading(false);
    }
  };

  // Drag and drop logic
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

const handleLinkClick = (e, index) => {
  e.preventDefault(); // Prevent default navigation
  const link = previewContent[index]?.link || '';
  if (link) {
    window.open(link.startsWith('http') ? link : `http://${link}`, '_blank');
  }
};
  return (
    <div>
    <nav className="navbar">
      <div><h3>Template Builder</h3></div>
      <div>
          <button onClick={() => setIsMobileView(false)} className="navbar-button"><FaDesktop/> Desktop</button>
          <button onClick={() => setIsMobileView(true)} className="navbar-button"><MdPhoneAndroid/> Mobile</button>
          <button onClick={() => setModalOpen(true)} className="navbar-button"><MdSend/>Test Mail</button>
          </div>
        </nav>
    <div className="app-container">
      {/* Left Editor */}
      <div className="editor">
        <div className="edit-btn">
        <button onClick={addLogo} className="editor-button"><MdAddPhotoAlternate/> Logo</button>  
        <button onClick={addHeading} className="editor-button"><FaHeading/> Heading</button>
        <button onClick={addText} className="editor-button"><FaParagraph/> Paragraph</button>
        <button onClick={addImage} className="editor-button"><FaImage/> Image</button>
        <button onClick={addButton} className="editor-button"><FaPlusSquare/> Button</button>
       
         </div>
         <div className ="editor-bg">Template Background
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="bg-color-picker"
        />
        </div>
       {/* Styling Controls */}
{selectedIndex !== null && previewContent[selectedIndex] && (
  <div className="style-controls">
    <h3>Style Controls</h3>
    <div className="style-item">
      {previewContent[selectedIndex].type === 'para' && (
        <>
          <label>Font Size:</label>
          <input
            type="number"
            value={parseInt(previewContent[selectedIndex].style.fontSize.replace('px', ''))}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, fontSize: `${e.target.value}px` } })
            }
          />
          <div className='editor-bg'>Text Color
          <input
            type="color"
            value={previewContent[selectedIndex].style.color}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, color: e.target.value } })
            }
          />
          </div>
          <div className='editor-bg'>Text Background
          <input
            type="color"
            value={previewContent[selectedIndex].style.backgroundColor || '#ffffff'}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, backgroundColor: e.target.value } })
            }
          />
          </div>
          <label>Text Alignment:</label>
          <select
            value={previewContent[selectedIndex].style.textAlign}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, textAlign: e.target.value } })
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </>
      )}

        {previewContent[selectedIndex].type === 'head' && (
        <>
          <label>Font Size:</label>
          <input
            type="number"
            value={parseInt(previewContent[selectedIndex].style.fontSize.replace('px', ''))}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, fontSize: `${e.target.value}px` } })
            }
          />
          <div className='editor-bg'>Text Color
          <input
            type="color"
            value={previewContent[selectedIndex].style.color}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, color: e.target.value } })
            }
          />
          </div>
          <div className='editor-bg'>Text Background
          <input
            type="color"
            value={previewContent[selectedIndex].style.backgroundColor || '#ffffff'}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, backgroundColor: e.target.value } })
            }
          />
          </div>
          <label>Text Alignment:</label>
          <select
            value={previewContent[selectedIndex].style.textAlign}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, textAlign: e.target.value } })
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </>
      )}
      
{previewContent[selectedIndex].type === 'button' && (
  <>
    <div className='editor-bg'>Background Color
    <input
      type="color"
      value={previewContent[selectedIndex].style.backgroundColor}
      onChange={(e) =>
        updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, backgroundColor: e.target.value } })
      }
    />
    </div>
    <div className='editor-bg'>Text Color
    <input
      type="color"
      value={previewContent[selectedIndex].style.color}
      onChange={(e) =>
        updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, color: e.target.value } })
      }
    />
    </div>
     <label>Text Alignment:</label>
            <select
              value={previewContent[selectedIndex]?.style?.textAlign || ''}
              onChange={(e) =>
                updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, textAlign: e.target.value } })
              }
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
    <label>Padding:</label>
    <input
      type="text"
      value={previewContent[selectedIndex].style.padding}
      onChange={(e) =>
        updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, padding: e.target.value } })
      }
    />
    
    <label>Border Radius:</label>
    <input
      type="number"
      value={parseInt(previewContent[selectedIndex].style.borderRadius.replace('px', ''))}
      onChange={(e) =>
        updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, borderRadius: `${e.target.value}px` } })
      }
    />
    <label>Link:</label>
    <input
      type="text"
      placeholder="Enter URL"
      value={previewContent[selectedIndex].link || ''}
      onChange={(e) => updateContent(selectedIndex, { link: e.target.value })}
    />
  </>
)}
  {previewContent[selectedIndex].type === 'logo' && (
        <>
          <label>Width (%):</label>
          <input
            type="number"
            value={parseInt(previewContent[selectedIndex].style.width.replace('%', ''))}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, width: `${e.target.value}%` } })
            }
          />
          <label>Height (px):</label>
          <input
            type="number"
            value={parseInt(previewContent[selectedIndex].style.height.replace('px', ''))}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, height: `${e.target.value}px` } })
            }
          />
          <div className='editor-bg'>Image Background
          <input
            type="color"
            value={previewContent[selectedIndex].style.backgroundColor || '#ffffff'}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, backgroundColor: e.target.value } })
            }
          />
          </div>
          <label>Image Alignment:</label>
          <select
            value={previewContent[selectedIndex].style.textAlign}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, textAlign: e.target.value } })
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </>
      )}

      {previewContent[selectedIndex].type === 'image' && (
        <>
          <label>Width (%):</label>
          <input
            type="number"
            value={parseInt(previewContent[selectedIndex].style.width.replace('%', ''))}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, width: `${e.target.value}%` } })
            }
          />
          <label>Height (px):</label>
          <input
            type="number"
            value={parseInt(previewContent[selectedIndex].style.height.replace('px', ''))}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, height: `${e.target.value}px` } })
            }
          />
          <div className='editor-bg'>Image Background
          <input
            type="color"
            value={previewContent[selectedIndex].style.backgroundColor || '#ffffff'}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, backgroundColor: e.target.value } })
            }
          />
          </div>
          <label>Image Alignment:</label>
          <select
            value={previewContent[selectedIndex].style.textAlign}
            onChange={(e) =>
              updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, textAlign: e.target.value } })
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </>
      )}
    </div>
  </div>
)}



      </div>

      {/* Right Preview */}
      <div className="preview-container">
        

        <div
          className={`template-preview ${isMobileView ? 'mobile-view' : ''}`}
          style={{ backgroundColor: bgColor }}>
          <div className="preview-card" style={{ backgroundColor: bgColor }}>
{previewContent.map((item, index) => {
  if (!item || !item.type) {
    return null; // Skip rendering undefined or malformed items
  }
  return (
    <div
      key={index}
      draggable
      onDragStart={() => handleDragStart(index)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => handleDrop(index)}
      className="content-item"
      onClick={() => handleItemClick(index)}
      style={item.style}
    >
      {item.type === 'para' && (
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateContent(index, { content: e.target.textContent })}
          style={item.style}
        >
          {item.content}
        </p>
      )}
       {item.type === 'head' && (
        <p
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateContent(index, { content: e.target.textContent })}
          style={item.style}
        >
          {item.content}
        </p>
      )}
      {item.type === 'image' && (
        <div>
        <img
          src={item.src || 'https://via.placeholder.com/200'}
          alt="Editable"
          className="img"
          style={item.style}
        />
        </div>
      )}
       {item.type === 'logo' && (
        <div>
        <img
          src={item.src || 'https://via.placeholder.com/200'}
          alt="Editable"
          className="logo"
          style={item.style}
        />
        </div>
      )}
      {item.type === 'button' && (
        <div>
  <a
    href={item.link || '#'}
    target="_blank"
    rel="noopener noreferrer"
    style={item.style}
    className="button-preview"
  >
    {item.content}
  </a>
  </div>
)}
 {item.type === 'link' && (
  <div>
              <a
                href={item.href || '#'}
                onClick={(e) => handleLinkClick(e, index)}
                style={item.style}
              >
                {item.content}
              </a>
              </div>
            )}

      <button className="delete-btn" onClick={() => deleteContent(index)}>
        <FiTrash2/>
      </button>
    </div>
  );
})}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>Send Test Mail</h2>
            <input
              type="email"
              placeholder="Recipient Email"
              value={emailData.recipient}
              onChange={(e) => setEmailData({ ...emailData, recipient: e.target.value })}
            />
            <input
              type="text"
              placeholder="Subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            />
           
            <button onClick={sendEmail} className="modal-button"disabled={isLoading}>{isLoading ? "Processing..." : "Send"}</button>
            <button onClick={() => setModalOpen(false)} className="modal-button">Cancel</button>
          </div>
        </div>
      )}
    </div>
          <ToastContainer />
    </div>
  );
};

export default App;
