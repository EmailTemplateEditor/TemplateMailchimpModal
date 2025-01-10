const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const multer = require('multer');
const {
    CloudinaryStorage
} = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;


const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configure MongoDB
mongoose.connect('mongodb://localhost:27017/template_editortoday', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
      .catch(err => console.error('Could not connect to MongoDB', err));

const TemplateSchema = new mongoose.Schema({
    previewContent: Array,
    bgColor: String,
    emailData:Array
});

const Template = mongoose.model('Template', TemplateSchema);

// Configure Cloudinary
cloudinary.config({
   cloud_name: "dycpqrh2n", // Replace with your Cloudinary cloud name
       api_key: "887442727788494", // Replace with your Cloudinary API key
       api_secret: "iJ_zEPVps-knWZEDsMksgQSrfkA", // Replace with your Cloudinary API secret
});

// Configure Multer with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'template_editor',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    },
});

const upload = multer({
    storage
});

// Upload image to Cloudinary
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file && req.file.path) {
        res.json({
            imageUrl: req.file.path
        });
    } else {
        res.status(400).send('Image upload failed');
    }
});

// Save template to DB
app.post('/save', async (req, res) => {
    const {
        previewContent,
        bgColor,emailData
    } = req.body;
    const template = new Template({
        previewContent,
        bgColor,emailData
    });
    await template.save();
    res.send('Saved');
});
// Send testemail with Nodemailer
app.post('/sendtestmail', async (req, res) => {
    const {
        emailData,
        previewContent,
        bgColor
    } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "megarajan55@gmail.com", // Replace with your email
            pass: "nspa ekns usue zdol" // Replace with your email password or app-specific password
        },
    });
  const emailcontent = `
  <div class="sub-main" style="background-color:${bgColor};box-shadow:0 4px 8px rgba(0, 0, 0, 0.2);border:1px solid rgb(255, 245, 245);padding:20px;width:650px;height:auto;border-radius:10px;margin:0 auto;">
    ${previewContent
      .map((item) => {
        if (item.type === 'para') {
          return `<div style="border-radius:10px;font-size:${item.style.fontSize};padding:10px; color:${item.style.color}; margin-top:20px; background-color:${item.style.backgroundColor}">${item.content}</div>`;
        } else if (item.type === 'head') {
          return `<p style="font-size:${item.style.fontSize};border-radius:10px;padding:10px;font-weight:bold;color:${item.style.color};text-align:${item.style.textAlign};background-color:${item.style.backgroundColor}">${item.content}</p>`;
        } else if (item.type === 'logo') {
          return `<div style="width:${item.style.width};text-align:${item.style.textAlign};border-radius:10px;background-color:${item.style.backgroundColor};">
                    <img src="${item.src}" style="width:30%;height:${item.style.height};"/>
                  </div>`;
        } else if (item.type === 'image') {
          return `<img src="${item.src}" style="width:${item.style.width};height:${item.style.height};border-radius:10px;text-align:${item.style.textAlign};background-color:${item.style.backgroundColor}"/>`;
        } else if (item.type === 'button') {
          return `<div style="text-align:${item.style.textAlign || 'left'};margin-top:20px;">
                    <a href="${item.link || '#'}" target="_blank" style="display:inline-block;padding:12px 25px;width:${item.style.width || 'auto'};color:${item.style.color || '#000'};text-decoration:none;background-color:${item.style.backgroundColor || '#f0f0f0'};text-align:${item.style.textAlign || 'left'};border-radius:${item.style.borderRadius || '0px'};">
                      ${item.content || 'Button'}
                    </a>
                  </div>`;
        }
      })
      .join('')}  
  </div>`;

const mailOptions = {
  from: 'megarajan55@gmail.com',
  to: emailData.recipient,
  subject: emailData.subject,
  message: emailData.message,
  html: `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
          @media(max-width:768px) {
            .sub-main{ 
                width:330px !important; 
            }
          }
        </style>
      </head>
      <body>
          <div style="display:none !important; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
            ${emailData.message}  
          </div>
        <div class="main">
          ${emailcontent}  
        </div>
      </body>
    </html>
  `,
};

transporter.sendMail(mailOptions, (error) => {
  if (error) {
    return res.status(500).send(error.toString());
  }
  res.send('Email Sent');
});
});


app.post('/sendexcelEmail', async (req, res) => {
  const { email, subject, body, bgcolor, previewtext } = req.body;

  if (!email) {
    return res.status(400).send("Email is required.");
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    //  port: 587, // Use 587 for STARTTLS
    //   secure: false, // STARTTLS requires secure to be false 
     auth: {
      user: "megarajan55@gmail.com",
      pass: "nspa ekns usue zdol"  // Use a secure app password
    }
  });

  try {
    // Parse the body string as JSON
    const bodyElements = JSON.parse(body);
    
    // Function to generate HTML from JSON structure
    const generateHtml = (element) => {
      const { type, content, src, style, link } = element;
      const styleString = Object.entries(style || {}).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}:${value}`).join(';');

      switch (type) {
        case 'logo':
             return `<img src="${src}" style="${styleString}" alt="image" />`;
        case 'image':
          return `<img src="${src}" style="${styleString}" alt="image" />`;
        case 'head':
          return `<h1 style="${styleString}">${content}</h1>`;
        case 'para':
          return `<p style="${styleString}">${content}</p>`;
        case 'button':
          return `<a href="${link}" style="${styleString}">${content}</a>`;
        default:
          return '';
      }
    };

    const dynamicHtml = bodyElements.map(generateHtml).join('');

    const mailOptions = {
      from: 'megarajan55@gmail.com',
      to: email,
      subject: subject,
      html: `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
              @media(max-width:768px) {
                .sub-main { width: 330px !important; }
              }
            </style>
          </head>
          <body>
            <div style="display:none !important; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
              ${previewtext}
            </div>
            <div class="main">
              <div class="sub-main" style="background-color:${bgcolor || "white"}; box-shadow:0 4px 8px rgba(0, 0, 0, 0.2); border:1px solid rgb(255, 245, 245); padding:20px;width:650px;height:auto;border-radius:10px;margin:0 auto;">
                ${dynamicHtml}
              </div>
            </div>
          </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${email}`);
    res.send('All Email sent successfully!');
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send(error.toString());
  }
});


// Start Server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});