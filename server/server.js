const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json()); 

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};
connectDB();

// Course Schema and Model
const contentSchema = new mongoose.Schema({
  topic: { type: String, required: true }
});
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true},
  courseId: { type: String, required: true },
  courseName: {type:String,required:true},
  image: { type: String, required: true },
  contents: [contentSchema],
  teacherId: { type: String, required: true },
  notes: {type:String,required:true}
});
const Course = mongoose.model('Course', courseSchema);

app.post('/api/students/:studentId/join-course', async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Find the student
    const student = await User.findOne({ rollno: studentId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if the course exists
    const course = await Course.findOne({ courseId });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Add course ID to the student's coursesJoined array if not already present
    if (!student.coursesJoined.includes(courseId)) {
      student.coursesJoined.push(courseId);
      await student.save();
    }

    res.status(200).json({ message: 'Course joined successfully' });
  } catch (error) {
    console.error('Error joining course:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});


// Update the get courses endpoint
app.get('/api/students/:studentId/courses', async (req, res) => {
  try {
    const { studentId } = req.params;

    // Find the student
    const student = await User.findOne({ rollno: studentId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find courses based on the student's joined courses
    const courses = await Course.find({ courseId: { $in: student.coursesJoined } });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Fetch course details by courseCode
app.get('/api/courses/code/:courseCode', async (req, res) => {
  const { courseCode } = req.params;

  try {
    const course = await Course.findOne({ courseId: courseCode });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching course details' });
  }
});

//Students Login Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true }, 
  rollno: { type: String, required: true },
  teacherId : { type: String, required: true},
  name: { type: String, required:true},
  address: { type: String, required:true},
  department: { type: String, required:true},
  className: { type: String, required:true},
  section: { type: String, required:true},
  year: { type: String, required:true},
  coursesJoined : [{type:String,required : true}]
}, { collection: 'managestudents' });
const User = mongoose.model('managestudents', userSchema);
//login student
app.post('/api/login', async (req, res) => {
  const { email, phone } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email' });
    if (user.phone !== phone) {
      return res.status(400).json({ message: 'Invalid phone' });
    }
    res.status(200).json({
      message: 'Login successful',
      name: user.name,
      rollno: user.rollno,
      teacherId: user.teacherId,
      phone: user.phone,
      address: user.address,
      department: user.department,
      className: user.className,
      section: user.section,
      year: user.year,
      email:user.email
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error in server page' });
  }
});
//fetch student
app.get('/api/managestudents/student/:rollno', async (req, res) => {
  try {
    const { rollno } = req.params;
    const student = await User.findOne({ rollno });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// CAT Schema
const catSchema = new mongoose.Schema({
  rollno: String,
  reports: [
    {
      catNumber: Number, 
      date: Date,
      marks: [{ subject: String, marks: Number }],
    },
  ],
},{ collection: 'cats' });
//SEM Schema
const semSchema = new mongoose.Schema({
  rollno: String,
  reports: [
    {
      semNumber: Number, 
      date: Date,
      marks: [
        {
          courseCode: String,
          courseId: String,
          credits: Number,
          marksScored: Number,
        },
      ],
    },
  ],
},{ collection: 'sems' });
const CAT = mongoose.model('CAT', catSchema);
const SEM = mongoose.model('SEM', semSchema);
// Endpoint to get CAT reports
app.get('/api/reports/CAT/:rollno', async (req, res) => {
  const { rollno } = req.params;
  try {
    const reports = await CAT.findOne({ rollno });
    if (reports) {
      return res.json({ reports: reports.reports });
    } else {
      return res.status(404).json({ message: 'No CAT reports found for this roll number' });
    }
  } catch (error) {
    console.error('Error fetching CAT reports:', error);
    res.status(500).json({ error: 'Failed to fetch CAT reports' });
  }
});
// Endpoint to get SEM reports
app.get('/api/reports/SEM/:rollno', async (req, res) => {
  const { rollno } = req.params;
  try {
    const reports = await SEM.findOne({ rollno });
    if (reports) {
      return res.json({ reports: reports.reports });
    } else {
      return res.status(404).json({ message: 'No SEM reports found for this roll number' });
    }
  } catch (error) {
    console.error('Error fetching SEM reports:', error);
    res.status(500).json({ error: 'Failed to fetch SEM reports' });
  }
});

// Assessment schema
const assessmentSchema = new mongoose.Schema({
  teacherId: String,
  name: String,
  marks: Number,
  images: [String],
  startDate: Date,
  endDate: Date,
  startTime: String,
  endTime: String
});
const Assessment = mongoose.model('Assessment', assessmentSchema);
// Get assessments by teacherId
app.get('/api/assessments/teacher/:teacherId', async (req, res) => {
  const teacherId = req.params.teacherId;
  try {
    const assessments = await Assessment.find({ teacherId });
    if (assessments.length === 0) {
      return res.status(404).json({ message: 'No assessments found for this teacher' });
    }
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Attendance Schema
const attendanceSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  attendance: [
    {
      periodNumber: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ['Present', 'Absent'],
        required: true,
      },
    },
  ],
});
const Attendance = mongoose.model('Attendance', attendanceSchema);
//Get attendance
app.get('/api/attendance/:rollNo/:date', async (req, res) => {
  try {
    const attendance = await Attendance.find({ 
      rollNo: req.params.rollNo, 
      date: req.params.date
    });
    if (attendance.length === 0) {
      return res.status(404).json({ message: 'Attendance not found for this date' });
    }
    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//discussions schema
const replySchema = new mongoose.Schema({
  name: String,
  replyMessage: String,
  date: { type: Date, default: Date.now },
});
const discussionSchema = new mongoose.Schema({
  teacherId: String,
  name: String,
  message: String,
  replies: [replySchema],
});
const Discussion = mongoose.model('Discussion', discussionSchema);
app.get('/api/discussions/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;
    const messages = await Discussion.find({ teacherId });
    if (!messages || messages.length === 0) {
      return res.status(404).json({ error: 'No messages found for this teacher' });
    } 
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});
// Add a new message
app.post('/api/discussions', async (req, res) => {
  try {
    const { teacherId, name, message } = req.body;
    const newMessage = new Discussion({ teacherId, name, message, replies: [] });
    await newMessage.save();
    res.json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});
// Add a new reply to a message
app.post('/api/discussions/reply', async (req, res) => {
  const { discussionId, reply } = req.body;
  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }
    discussion.replies.push(reply);
    await discussion.save();
    res.status(200).json(discussion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saving reply' });
  }
});

//Live-Session Schema
const liveSessionSchema = new mongoose.Schema({
  teacherId: String,
  name:  String,
  time:  String,
  date:  Date,
  link:  String,    
}); 
const liveSession = mongoose.model('liveSession', liveSessionSchema);
//live-session
app.get('/api/live-sessions/:teacherId', async (req, res) => {
  const { teacherId } = req.params;
  try {
    const sessions = await liveSession.find({ teacherId }); // Replace "Meeting" with your actual model
    if (sessions && sessions.length > 0) {
      return res.json(sessions);
    } else {
      return res.status(404).json({ message: 'No live sessions found for this teacherId' });
    }
  } catch (error) {
    console.error('Error fetching live sessions:', error);
    res.status(500).json({ error: 'Failed to fetch live sessions' });
  }
});

//Platform-Schema
const platformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  link: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  image: { type: String, required: true },
  status: { type: String, enum: ['live', 'archived'], required: true },
  teacherid: { type: String, required: true },
}, { timestamps: true });
const Platform = mongoose.model('Platform', platformSchema);
app.get('/api/platforms/:teacherId', async (req, res) => {
  const { teacherId } = req.params;
  try {
    const platforms = await Platform.find({ teacherid: teacherId });
    if (platforms.length === 0) {
      return res.status(404).json({ message: "No platforms found for this teacher." });
    }
    res.status(200).json(platforms);
  } catch (error) {
    console.error("Error fetching platform data:", error);
    res.status(500).json({ message: "An error occurred while fetching platform data." });
  }
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
