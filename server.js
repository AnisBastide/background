const swaggerJSDoc = require('swagger-jsdoc');
const cors = require('cors'); // Import the 'cors' middleware
const swaggerUi = require('swagger-ui-express');
const express = require('express')
const { PrismaClient } = require("@prisma/client");
const app = express()
const port = 3000
var morgan = require('morgan');
const allowedOrigins = process.env.FRONT_URL;
const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

const prisma = new PrismaClient()


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Swagger',
            version: '1.0.0',
            description: 'Documentation for your API',
        },
    },
    // API routes and JSDoc comments go here
    apis: ['server.js'],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(morgan('combined'))


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
app.get('/', (req, res) => {
    res.send('Hello World!')
})

/**
 * @swagger
 * /background:
 *   get:
 *     description: get a background and treasures
 *     responses:
 *       200:
 *         description: Success
 */
app.get('/background', async (req, res) => {
    const backgrounds = await prisma.backgroundImage.findMany()
    const number = getRandomInt(backgrounds.length - 1)
    const background = backgrounds[number]
    const treasures = await getTreasures(10, background.width, background.height)
    const response = {
        map: background.link,
        width: background.width,
        height: background.height,
        treasures: treasures
    }
    res.send(response)
});

app.post('/background', async (req, res) => {
    try {
        console.log(req.body);
        const { link, width, height } = req.body;

        const newBackground = await prisma.backgroundImage.create({
            data: {
                link,
                width,
                height,
            },
        });

        res.status(201).json(newBackground);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la création du background image.' });
    }
});

app.post('/treasure', async (req, res) => {
    try {
        console.log(req.body);
        const { image, score } = req.body;

        const newTreasure = await prisma.treasures.create({
            data: {
                image,
                score
            },
        });

        res.status(201).json(newTreasure);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la création du treasure.' });
    }
});

app.delete('/background/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const background = await prisma.backgroundImage.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!background) {
            return res.status(404).json({ error: 'Background image non trouvé.' });
        }

        await prisma.backgroundImage.delete({
            where: {
                id: parseInt(id),
            },
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la suppression du background image.' });
    }
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

async function getTreasures(treasuresCount, width, height) {
    treasures = []
    const treasuresInDb = await prisma.treasures.findMany()
    for (let i = 0; i < treasuresCount; i++) {
        const number = getRandomInt(treasuresInDb.length - 1)
        const treasure = treasuresInDb[number]
        treasures.push({ id: i, posX: getRandomInt(width), posY: getRandomInt(height), image: treasure.image, value: treasure.score })
    }

    return treasures
}

module.exports = {
    getTreasures,
};