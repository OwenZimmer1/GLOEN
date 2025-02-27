// pages/api/predict.js

import { spawn } from 'child_process';
import fs from 'fs';
import formidable from 'formidable';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js' built-in body parser.
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = './uploads'; // You can change this if needed.
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Error parsing form:", err);
      return res.status(500).json({ error: 'Error parsing the file' });
    }

    let file = files.image;
    if (Array.isArray(file)) {
      file = file[0];
    }
    if (!file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const filePath = file.filepath || file.path;
    if (!filePath) {
      console.error("File object does not have a valid path:", file);
      return res.status(400).json({ error: 'No valid file path provided.' });
    }

    // Spawn the Python script predict.py.
    // Adjust 'python' to 'python3' if needed.
    const pythonProcess = spawn('python', ['predict.py', filePath]);

    let dataString = '';
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error("Python stderr:", data.toString());
    });

    pythonProcess.on('close', (code) => {
      // Delete the temporary uploaded file.
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting temp file:", err);
      });
      if (code !== 0) {
        console.error(`Python script exited with code ${code}`);
        return res.status(500).json({ error: `Python script error: ${code}` });
      }
      try {
        const predictions = JSON.parse(dataString);
        return res.status(200).json(predictions);
      } catch (e) {
        console.error("Error parsing JSON output from Python:", e);
        return res.status(500).json({ error: "Error parsing prediction output" });
      }
    });
  });
}
