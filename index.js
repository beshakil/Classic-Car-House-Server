const express = require('express');
const app = express()
const cors = require('cors');
const admin = require("firebase-admin");
require('dotenv').config()
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


// DB_USER=doctors-portal
// DB_PASS=JJ3YvpB7S78UOcFC

const serviceAccount = {
    "type": "service_account",
    "project_id": "classic-car-house",
    "private_key_id": "03647fa5fb24b69dc914139e58eccddf5719de3c",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCu4MJJQmUrj65+\nNj+UFjDTOLie1c7EBoyL3l42+lZSfcgEk3hLnMS13upLCQPMc7+I7hYFnlQAvR4u\nyuXZzRp/ggD29GCx7AcAKDhdoFm2nk6BtgVLFo45SXTIPnKSJyof33iREZxyoVZR\noi96Ihw8dg1h94Ho/TYeCK0Qgkd82zyZctIC0nFzGgU0TNiN/UWg6BHNKKv5feUD\nw3UD2mkgnNAbwf+YPwcAi2HF79C2K6bQN5NV0eXD8u/EQaQ66St6Z2MmL55mYQO3\nBh3cjnYlpjXspRHnAv610mlMj07a+h4U27NFuiAxVlrg/b3p5F3kMhb6LKskEHJ1\nUSsUE0THAgMBAAECggEAGhjIZY5W8q06aPNHgZ3eI2cvheR6Op6Pkr/YZ3PsNds3\nYhdvuDjo0gs2A4SQ4I3VY2XEO4ppFsMiIfF9Y4dMEQMhibjmRSbn1Ior/yzStoHh\nTVIQcCgpiTsBBnDrQAxAKQl8QInUQvb4nq4JT7yPYiZr0NbSuCYxUUISMYh/io4d\nzBb9Mb247xMwX+Q7C9w91tG2Tq7SPkbsRY4MjO6ZOD13Wnl8Gv+45rZF3adRF62s\nZgJQdjAZ7JfuIGRcVopjb5+78ElvWH+NwvqH7NimO5NRW4b+Eq+ZTZ+6hFSoGSzO\ngmr65/HYozPt5UKEvozfYrXybqmntQZNlm4mM/Wu4QKBgQDZm5Y/Ai22hKadCEQc\nJYSIYyWuwSkpqpmJKZbVOMuBNqPpozMcYJU0NCSMHezChG97kke3TTG1NXDKtFo1\n6SMiF5tM5vqgM2RglDl2tEYdqfLHntTyr9rcG+m12aZYuRO+GLGkD/6xOQ2fbSYy\nSs/WG9yDtdhYKiV0POTyuJzGjQKBgQDNuz/neqbBFoyM16CVdL2W8cGf3ob4mCdo\nMdrmfqWfYoU2rONQ1E3legWMyNuddHakz5z5cTW0C8o22nCtls53RZtOeNzXniCY\nmWu56mNHTlLerlclxJFB+vEtouLF0PC/tEx44kOIYqXju3LEqCWmrlU7MgEF2Cab\nDAkMpAZ9owKBgCBrkcLpbC4ZLUmQBbW70TcQrniOxrcyd5V74MD7qTYjEeCpM+Ay\nc4hHjHpjqvaADKv4az7f/VvmDlvk6tvFVDqsEbMvZn+fqIDLFJSe3yNkQouDGm7d\nzFmmvvcc6i+lw087Fpw+1c9JlMH/3QT5KGXZ2My2tvjLrrDWsbWH07OxAoGAUBB8\naTiZZvHAlxtfmmqJUhIZ2X6/pkWIqIsmdqd5C1NLJqEYAh/thM39FPIiTd/CQJev\nrn/5d21TMA/I5DWZel9zdpGg2KToaJrkisEGC/0WUSUmM0ORiE0ByVHn0TZkSyb+\nz9i2kYBasQsFOjV6Gakk8FmgfkbFl3eSmgHHqOMCgYBcWUHux7ufw79DUh6aElTS\ntYSqbgGoCmWMb4ilUWP96Swaa7Y5Ncjfu6NAmXafZG+FDug23D9EzPT+zlq269g9\n0DRD9Vi/nDZKY/zjVo4yWY3LSRjvmVqyBqogCUqsLeFidBF93WzXnOlWnsFb9Z+u\nAXx4ux9AJ0XDmHnqAMKLkA==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-kawee@classic-car-house.iam.gserviceaccount.com",
    "client_id": "111736771287947903405",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-kawee%40classic-car-house.iam.gserviceaccount.com"
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jd8bl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function verifyToken(req, res, next) {
    if (req.headers?.authorization?.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];

        try {
            const decodedUser = await admin.auth().verifyIdToken(token);
            req.decodedEmail = decodedUser.email;
        }
        catch {

        }

    }
    next();
}

async function run() {
    try {
        await client.connect();
        const database = client.db("classic_car_house");
        const allCarsCollection = database.collection("allCars");
        const usersCollection = database.collection("users");
        const ordersCollection = database.collection("orders");
        const reviewsCollection = database.collection("reviews");

        app.get('/allCars', async (req, res) => {
            const cursor = allCarsCollection.find({})
            const allCars = await cursor.toArray()
            res.send(allCars);
        })

        //add new car
        app.post('/allCars', async (req, res) => {
            const user = req.body;
            const allCars = await allCarsCollection.insertOne(user);
            res.json(allCars);
        });


        // GET single item by id and display the user info
        app.get('/allCars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const allCars = await allCarsCollection.findOne(query);
            res.json(allCars)
        })

        app.delete('/allCars/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const allCars = await allCarsCollection.deleteOne(query);
            res.json(allCars);
        })


        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            let isAdmin = false;

            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });



        //POST API Add A User
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });


        // POST API Add A User
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });


        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({})
            const orders = await cursor.toArray()
            res.send(orders);
        })

        //POST Submit Order API
        app.post('/orders', async (req, res) => {
            const orders = req.body;
            const result = await ordersCollection.insertOne(orders);
            res.json(result);
        });

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })


        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({})
            const reviews = await cursor.toArray()
            res.send(reviews);
        })

        // Submit Reviews
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewsCollection.deleteOne(query);
            res.json(result);
        })


        // app.put('/users/admin', async (req, res) => {
        //     const user = req.body;
        //     const filter = { email: user.email };
        //     const updateDoc = { $set: { role: 'admin' } };
        //     const result = await usersCollection.updateOne(filter, updateDoc);
        //     res.json(result);
        // })

        app.put('/users/admin', verifyToken, async (req, res) => {
            const user = req.body;
            const requester = req.decodedEmail;
            if (requester) {
                const requesterAccount = await usersCollection.findOne({ email: requester });
                if (requesterAccount.role === 'admin') {
                    const filter = { email: user.email };
                    const updateDoc = { $set: { role: 'admin' } };
                    const result = await usersCollection.updateOne(filter, updateDoc);
                    res.json(result);
                }
            }
            else {
                res.status(403).json({ message: 'you do not have access to make admin' })
            }

        })

    }
    finally {
        //await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello Classic Car House')
})

app.listen(port, () => {
    console.log('runtime', port)
})
