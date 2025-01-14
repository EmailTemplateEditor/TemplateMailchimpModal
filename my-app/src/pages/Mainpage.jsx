import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './Mainpage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaParagraph, FaImage, FaHeading, FaPlusSquare } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import { FaDesktop } from 'react-icons/fa';
import { MdPhoneAndroid } from 'react-icons/md';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { FiTrash2 } from "react-icons/fi";
import ParaEditor from '../component/ParaEditor.jsx';
// import { FaUndo, FaRedo } from "react-icons/fa";
import SendexcelModal from '../component/Importexcel.jsx'
import { AiOutlineFileExcel } from 'react-icons/ai';



const Mainpage = () => {
  const [isLoading, setIsLoading] = useState(false); // State for loader
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isMobileView, setIsMobileView] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({ recipient: '', subject: ''});
  const [selectedIndex, setSelectedIndex] = useState(null);  // Track selected content index
  const dragIndex = useRef(null);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
    const [activeTab, setActiveTab] = useState("content");
const [isModalOpen, setIsModalOpen] = useState(false);
const [showSendexcelModal, setShowSendexcelModal] = useState(false); // State for opening Sendexcelmail

  const [previewContent, setPreviewContent] = useState([]);
  useEffect(() => {
  console.log("PreviewContent in Parent Component:", previewContent);
}, [previewContent]);



  // Add new text
  const addText = () => {
         saveToUndoStack(); // Save the current state before deleting

    setPreviewContent([
      ...previewContent,
      { type: 'para', content: 'Replace Your Content...', style: { fontSize: '15px',borderRadius:'10px', textAlign: 'left', color: '#000000',padding:'10px 10px' } },
    ]);
  };
    const addHeading = () => {
           saveToUndoStack(); // Save the current state before deleting

    setPreviewContent([
      ...previewContent,
      { type: 'head', content: 'Heading', style: { fontSize: '25px',borderRadius:'10px', textAlign: 'center', color: '#000000',padding:'10px 5px',fontWeight:'bold' } },
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
          { type: 'image', src: imageUrl, style: { width: '100%', height: 'auto',borderRadius:'10px', textAlign: 'center'}},
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
          { type: 'logo', src: imageUrl, style: { width: '30%', height: 'auto',borderRadius:'10px', textAlign: 'center',margin:'0 auto'}},
        ]);
      } catch (err) {
        toast.error('Image upload failed');
      }
    };
    fileInput.click();
  };
  const addButton = () => {
         saveToUndoStack(); // Save the current state before deleting
    setPreviewContent([
      ...previewContent,
      {
        type: 'button',
        content: 'Click Me',
        style: {
          textAlign: 'center',
          padding: '12px 25px',
          backgroundColor: 'black',
          color: '#ffffff',
          width:'auto',
          marginTop:'5px',
          alignItem:'center',
          borderRadius: '5px'
        },
        link: "https://www.imageconindia.com/",
      },
    ]);
  };

  // Handle content editing

  const updateContent = (index, newContent) => {
       saveToUndoStack(); // Save the current state before deleting
  const updated = [...previewContent];
  updated[index] = { ...updated[index], ...newContent };
  setPreviewContent(updated);
};

  const handleItemClick = (index) => {
    setSelectedIndex(index); // Set the selected index when an item is clicked
  };

//delete
 const deleteContent = (index) => {
     saveToUndoStack(); // Save the current state before deleting
   const updated = previewContent.filter((_, i) => i !== index);
   setPreviewContent(updated);
   if (selectedIndex === index) {
     setSelectedIndex(null); // Reset selection if the deleted item was selected
   } else if (selectedIndex > index) {
     setSelectedIndex(selectedIndex - 1); // Adjust index
   }
 };
 const saveToUndoStack = () => {
   setUndoStack([...undoStack, [...previewContent]]);
   setRedoStack([]); // Clear redo stack whenever a new action is performed
 };

 // Undo action
 const undo = () => {
   if (undoStack.length > 0) {
     const previousState = undoStack.pop(); // Pop the last state
     setRedoStack([...redoStack, [...previewContent]]); // Save current state to redo stack
     setPreviewContent(previousState); // Revert to the previous state
   }
 };

 // Redo action
 const redo = () => {
   if (redoStack.length > 0) {
     const nextState = redoStack.pop(); // Pop the redo state
     setUndoStack([...undoStack, [...previewContent]]); // Save current state to undo stack
     setPreviewContent(nextState); // Reapply the redo state
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
    axios.post('http://localhost:5000/sendtestmail', {emailData, previewContent, bgColor})
    console.log('preview',previewContent);
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
 
  const handleEditorDrop = (e) => {
    e.preventDefault();
    const type = dragIndex.current;
    if (type === 'para') addText();
    else if (type === 'head') addHeading();
    else if (type === 'image') addImage();
    else if (type === 'logo') addLogo();
    else if (type === 'button') addButton();
    dragIndex.current = null; // Reset the type after drop
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop by preventing default
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
        <div>
          <h3>Template Builder</h3>
        </div>
        <div>
    <button
  onClick={undo}
  disabled={undoStack.length === 0}
  className="undo-btn"
  data-tooltip="Undo" // Custom tooltip using data attribute
>
  <i className="fas fa-undo-alt"></i>
  
</button>

<button
  onClick={redo}
  disabled={redoStack.length === 0}
  className="redo-btn"
  data-tooltip="Redo" // Custom tooltip using data attribute
>
  <i className="fas fa-redo-alt"></i>
</button>


          <button
            onClick={() => setIsMobileView(false)}
            className="navbar-button-Desktop"
          >
            <span className="Nav-icons">
              <FaDesktop />
            </span>{" "}
            {/* <span className="nav-names">Desktop</span> */}
          </button>
          <button
            onClick={() => setIsMobileView(true)}
            className="navbar-button-Desktop"
          >
            <span className="Nav-icons">
              <MdPhoneAndroid />
            </span>{" "}
            {/* <span className="nav-names">Mobile</span> */}
          </button>
          
       <button
            onClick={() => setShowSendexcelModal(true)}
            className="navbar-button-excel"
          >
            <span className="Nav-icons">
              <AiOutlineFileExcel/>
            </span>
            <span className="nav-names">Import Excel</span>
          </button>
          <button onClick={() => setModalOpen(true)} className="navbar-button">
            <span className="Nav-icons">
              <MdSend />
            </span>{" "}
            <span className="nav-names">Test Mail</span>
          </button>
        </div>
      </nav>

    <div className="app-container">
      {/* Left Editor */}
      <div className="editor">
        {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "content" ? "tab active" : "tab"}
          onClick={() => setActiveTab("content")}
        >
          Content
        </button>
        <button
          className={activeTab === "layout" ? "tab active" : "tab"}
          onClick={() => setActiveTab("layout")}
        >
          Layout Styles
        </button>
      </div>

       <div className="edit-btn">
      
      {/* Tab Content */}
      {activeTab === "content" && (
        <div className="content-tab">
          <button
            onClick={addLogo}
            className="editor-button"
            draggable
            onDragStart={(e) => handleDragStart("logo")}
          >
            <MdAddPhotoAlternate /> Logo
          </button>
          <button
            onClick={addHeading}
            className="editor-button"
            draggable
            onDragStart={(e) => handleDragStart("head")}
          >
            <FaHeading /> Heading
          </button>
          <button
            onClick={addText}
            className="editor-button"
            draggable
            onDragStart={(e) => handleDragStart("para")}
          >
            <FaParagraph /> Paragraph
          </button>
          <button
            onClick={addImage}
            className="editor-button"
            draggable
            onDragStart={(e) => handleDragStart("image")}
          >
            <FaImage /> Image
          </button>
          <button
            onClick={addButton}
            className="editor-button"
            draggable
            onDragStart={(e) => handleDragStart("button")}
          >
            <FaPlusSquare /> Button
          </button>
        </div>
      )}

      {activeTab === "layout" && (
        <div className="layout-tab">
          <div className ="editor-bg">Template Background
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="bg-color-picker"
        />
        </div>
        </div>
      )}
    </div>
  
        
       {/* Styling Controls */}
{selectedIndex !== null && previewContent[selectedIndex] && (
  <div className="style-controls">
    <h3>Style Controls</h3>
    <div className="style-item">
      {previewContent[selectedIndex].type === 'para' && (
        <>
         
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

    <label>Button Size:</label>
    <div>
      <button className='modal-btn'
        onClick={() => updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, width: 'auto' } })}
      >
        Small
      </button>
      <button className='modal-btn'
        onClick={() => updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, width: '60%',margin:'0 auto'} })}
      >
        Medium
      </button>
      <button className='modal-btn'
        onClick={() => updateContent(selectedIndex, { style: { ...previewContent[selectedIndex].style, width: '90%' } })}
      >
        Large
      </button>
    </div>

    <label>Border Radius:</label>
    <input
      type="range"
      min="0"
      max="50"
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
          style={{ backgroundColor: bgColor }}
           onDrop={handleEditorDrop}
          onDragOver={handleDragOver}>
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
  <>
    <p className='border'
      contentEditable
      suppressContentEditableWarning
      onClick={() => {
        setSelectedIndex(index);
        setIsModalOpen(true);  // Open the modal
      }}
      style={item.style}
      dangerouslySetInnerHTML={{ __html: item.content }}  // Render HTML content here
    />
    <ParaEditor
      isOpen={isModalOpen}
      content={item.content}  // Pass the content to the modal
      style={item.style}
      onSave={(newContent) => {
        updateContent(index, { content: newContent });  // Save the new content
        setIsModalOpen(false);  // Close the modal after saving
      }}
      onClose={() => setIsModalOpen(false)}  // Close the modal without saving
    />
  </>
)}


       {item.type === 'head' && (
        <p className='border'
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateContent(index, { content: e.target.textContent })}
          style={item.style}
        >
          {item.content}
        </p>
      )}
      {item.type === 'image' && (
        <div className='border'> 
        <img
          src={item.src || 'https://via.placeholder.com/200'}
          alt="Editable"
          className="img"
          style={item.style}
        />
        </div>
      )}



       {item.type === 'logo' && (
        <div className='border'>
        <img
          src={item.src || 'https://via.placeholder.com/200'}
          alt="Editable"
          className="logo"
          style={item.style}
        />
        </div>
      )}
      {item.type === 'button' && (
        <div className='border-btn'>
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
  <div className='border-btn'>
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

        {/* Show Sendexcelmail when button is clicked */}
        {showSendexcelModal && (
        <SendexcelModal
          isOpen={showSendexcelModal}
          onClose={() => setShowSendexcelModal(false)}
          previewContent={previewContent}  // Pass segments to Sendexcelmail
        />
      )}

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
             <input
              type="text"
              placeholder="Preview Text"
              value={emailData.message}
              onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
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

export default Mainpage;