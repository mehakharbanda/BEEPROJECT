// borrowals.js in the routes folder
const express = require('express');
const router = express.Router();
const Student = require('../models/Student');  // Import the Student model

// Define the GET route for /borrowals
router.get('/', (req, res) => {
  res.render('borrowals'); // This will render the borrowals.ejs page
});


// Define the search route for students
router.get('/searchStudent', async (req, res) => {
  const studentName = req.query.fullName;

  try {
    const student = await Student.findOne({ fullName: studentName });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student); // Send student details back
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student data' });
  }
});

// Define the POST route for updating return details
router.post('/updateReturnDetails', async (req, res) => {
  const { studentName, returnedOn } = req.body;

  try {
    const student = await Student.findOne({ fullName: studentName });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update the return date
    student.returnDate = returnedOn;
    
    // Logic to calculate fine based on the return date and returned date
    const dueDate = new Date(student.dueDate);
    const returnedOnDate = new Date(returnedOn);

    let fine = 0;
    const timeDiff = returnedOnDate - dueDate;
    
    // Fine calculation: If returned after the due date, calculate fine
    if (timeDiff > 0) {
      fine = Math.ceil(timeDiff / (1000 * 3600 * 24)) * 50; // 50 rupees per day after due date
    }

    // Set the fine for the student
    student.fine = fine;

    // Save the updated student details with the new return date and fine
    await student.save();

    // Respond with a success message and the calculated fine
    res.json({ message: 'Return details updated and fine calculated', fine });
  } catch (err) {
    res.status(500).json({ message: 'Error updating return details' });
  }
});
// Route to render payment page
router.get('/payment', (req, res) => {
  const { userName, fine } = req.query;
  
  if (userName && fine) {
    // Render the payment page and pass the userName and fine as data
    res.render('payment', { userName, fine });
  } else {
    // If no userName or fine provided, redirect back to borrowals page
    res.redirect('/borrowals');
  }
});




module.exports = router;
