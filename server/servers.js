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
// Send email with Nodemailer
app.post('/send', async (req, res) => {
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

    const mailOptions = {
        from: 'megarajan55@gmail.com',
        to: emailData.recipient,
        subject: emailData.subject,
        message: emailData.message,
        html: `
        <div style="background-color:${bgColor}; padding:20px; width:350px; height:auto; border-radius:10px; margin:0 auto;">
            ${previewContent
                .map((item) => {
                    if (item.type === 'para') {
                        return `<p style="font-size:${item.style.fontSize}; color:${item.style.color}; text-align:${item.style.textAlign}; background-color:${item.style.backgroundColor}">${item.content}</p>`;
                    }
                    else if (item.type === 'head') {
                        return `<p style="font-size:${item.style.fontSize};fontWeight:bold;color:${item.style.color}; text-align:${item.style.textAlign}; background-color:${item.style.backgroundColor}">${item.content}</p>`;
                    } else if (item.type === 'logo') {
                        return `
                        <div style ="width:${item.style.width}; text-align:${item.style.textAlign}; background-color:${item.style.backgroundColor};" >
                        <img src="${item.src}" style="width:30%;height:${item.style.height};"/>
                        </div>
                        `;
                    }
                    else if (item.type === 'image') {
                        return `
                        <img src="${item.src}" style="width:${item.style.width}; height:${item.style.height}; text-align:${item.style.textAlign}; background-color:${item.style.backgroundColor}" />
                        `;
                    } else if (item.type === 'button') {
                        return `
                        <div style="text-align:${item.style.textAlign};margin-top:20px;">

                        <a href="${item.link}" target="_blank" style="padding:${item.style.padding}; color:${item.style.color}; text-decoration:none; background-color:${item.style.backgroundColor}; text-align:${item.style.textAlign}; border-radius:${item.style.borderRadius};">${item.content}</a>
                       </div> `;
                    }
                })
                .join('')}
        </div>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.send('Email Sent');
    });
});

// Start Server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});