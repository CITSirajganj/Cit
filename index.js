const express = require('express');
const app = express();
const cors = require('cors');
const { ObjectId } = require('mongodb'); // Import ObjectId


require('dotenv').config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// //////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////




const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wfbcpzp.mongodb.net/?retryWrites=true&w=majority`;


async function run() {
    try {

        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });

        const store_id = process.env.StoreID
        const store_passwd = process.env.StorePassword
        const is_live = false //true for live, false for sandbox

        await client.connect();

        //////////////////////////////////////////////////////////
        //////////////All Mongodb Collections start here//////////
        /////////////////////////////////////////////////////////
        const noticeCollection = client.db('CIT').collection('noticeCollection');

        const employeeCollection = client.db('CIT').collection('employeeCollection');

        const classLectureCollection = client.db('CIT').collection('classLectureCollection');

        const breakingNewsCollection = client.db('CIT').collection('breakingNewsCollection');



        // add breaking news to DB
        app.post('/addBreakingNews', async (req, res) => {
            try {
                const formData = req.body;
                await breakingNewsCollection.insertOne(formData);
                res.status(201).json({ message: 'Breaking News added successfully' });
            } catch (error) {
                console.error('Error inserting breaking news data:', error);
                res.status(500).json({ message: 'An error occurred', error: error.message });
            }
        });

        // Getting all breaking news from DB
        app.get('/allBreakingNews', async (req, res) => {
            try {
                const breakingNews = await breakingNewsCollection.find().toArray();
                res.json(breakingNews);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error fetching breaking news', error: error.message });
            }
        });

        // delete breaking news by id
        app.delete('/deleteBreakingNews/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const objectId = new ObjectId(id); // Construct ObjectId with 'new'
                const result = await breakingNewsCollection.deleteOne({ _id: objectId });
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: 'Breaking News deleted successfully' });
                } else {
                    res.status(404).json({ message: 'Breaking News not found' });
                }
            } catch (error) {
                console.error('Error deleting breaking news:', error);
                res.status(500).json({ message: 'An error occurred while deleting breaking news' });
            }
        });

        // Route to handle form data of class Lecture adding
        app.post('/addClassLecture', async (req, res) => {
            try {
                const formData = req.body;
                await classLectureCollection.insertOne(formData);
                res.status(201).json({ message: 'Class Lecture added successfully' });
            } catch (error) {
                console.error('Error inserting class Lecture data:', error);
                res.status(500).json({ message: 'An error occurred', error: error.message });
            }
        });

        // Getting all class lectures from DB
        app.get('/allClassLectures', async (req, res) => {
            try {
                const classLectures = await classLectureCollection.find().toArray();
                res.json(classLectures);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error fetching class lectures', error: error.message });
            }
        });
        
        // delete class lecture by id 
        app.delete('/deleteClassLecture/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const objectId = new ObjectId(id); // Construct ObjectId with 'new'
                const result = await classLectureCollection.deleteOne({ _id: objectId });
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: 'Class Lecture deleted successfully' });
                } else {
                    res.status(404).json({ message: 'Class Lecture not found' });
                }
            } catch (error) {
                console.error('Error deleting class Lecture:', error);
                res.status(500).json({ message: 'An error occurred while deleting class Lecture' });
            }
        });
        
        
        // Route to handle form data of notice adding
        app.post('/addNotice', async (req, res) => {
            try {
                const formData = req.body;
                await noticeCollection.insertOne(formData);
                res.status(201).json({ message: 'Notice added successfully' });
            } catch (error) {
                console.error('Error inserting notice data:', error);
                res.status(500).json({ message: 'An error occurred', error: error.message });
            }
        });
        // Getting all notices from DB sorted by date in descending order
        app.get('/allNotices', async (req, res) => {
            try {
                const notices = await noticeCollection.find().sort({ timestamp: -1 }).toArray();
                res.json(notices);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error fetching notices', error: error.message });
            }
        });

        // Getting a single notice by ID and dlt
        app.delete('/deleteNotice/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const objectId = new ObjectId(id); // Construct ObjectId with 'new'
                const result = await noticeCollection.deleteOne({ _id: objectId });
                if (result.deletedCount === 1) {
                    res.status(200).json({ message: 'Notice deleted successfully' });
                } else {
                    res.status(404).json({ message: 'Notice not found' });
                }
            } catch (error) {
                console.error('Error deleting notice:', error);
                res.status(500).json({ message: 'An error occurred while deleting notice' });
            }
        });

        // add employee to DB 
        app.post('/addEmployee', async (req, res) => {
            try {
                const formData = req.body;
                await employeeCollection.insertOne(formData);
                res.status(201).json({ message: 'Employee added successfully' });
            } catch (error) {
                console.error('Error inserting employee data:', error);
                res.status(500).json({ message: 'An error occurred', error: error.message });
            }
        });

        // getting all employees from DB
        app.get('/allEmployees', async (req, res) => {
            try {
                const employees = await employeeCollection.find().toArray();
                res.json(employees);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error fetching employees', error: error.message });
            }
        });




        ////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////////////////////////////
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error(error, process.env.DB_USER);
    }
}




run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('CM Academy is on');
});

app.listen(port, () => {
    console.log(`CM Academy is on port ${port}`);
});




