const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/gradecalculatorDB', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB successfully');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
  });
const studentSchema = new mongoose.Schema({
  name: String,
  tamil: Number,
  english: Number,
  maths: Number,
  comp: Number,
  phy: Number,
  totalGrades: Number,
  percentage: Number,
  overallGrade: String,
  overallResult: String
});







const Student = mongoose.model('Student', studentSchema);

// Serve the HTML file at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to handle the form submission
app.post('/submit-grades', async (req, res) => {
  const { name, tamil, english, maths, comp, phy } = req.body;

  const totalGrades = tamil + english + maths + comp + phy;
  const percentage = (totalGrades / 500) * 100;
  const overallGrade = calculateGrade(percentage);
  const overallResult = percentage >= 39.5 ? 'PASS' : 'FAIL';

  const student = new Student({
    name,
    tamil,
    english,
    maths,
    comp,
    phy,
    totalGrades,
    percentage,
    overallGrade,
    overallResult
  });

  try {
    await student.save();
    res.json({
      message: 'Student grades saved successfully!',
      data: {
        totalGrades,
        percentage,
        overallGrade,
        overallResult,
        subjectGrades: {
          tamil: calculateGrade(tamil),
          english: calculateGrade(english),
          maths: calculateGrade(maths),
          comp: calculateGrade(comp),
          phy: calculateGrade(phy)
        },
        subjectResults: {
          tamil: passOrFail(tamil),
          english: passOrFail(english),
          maths: passOrFail(maths),
          comp: passOrFail(comp),
          phy: passOrFail(phy)
        }
      }
    });
  } catch (error) {
    console.error('Error saving student grades:',error);
    res.status(500).send('Error saving student grades');
  }
});

// Function to calculate grade for a given score
const calculateGrade = (score) => {
  if (score <= 100 && score >= 80) {
    return 'A';
  } else if (score <= 79 && score >= 60) {
    return 'B';
  } else if (score <= 59 && score >= 40) {
    return 'C';
  } else {
    return 'F';
  }
};

// Function to determine pass/fail for a given score
const passOrFail = (score) => {
  return score >= 40 ? 'PASS' : 'FAIL';
};

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
