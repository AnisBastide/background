const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express')
const {PrismaClient} = require("@prisma/client");
const app = express()
const port = 3000

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
    const treasures = await getTreasures(10,background.width,background.height)
    const response = {
        map:background.link,
        width:background.width,
        height:background.height,
        treasures:treasures
    }
    res.send(response)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

async function getTreasures(treasuresCount,width,height) {
    treasures = []
    const treasuresInDb = await prisma.treasures.findMany()
    for (let i = 0; i < treasuresCount; i++) {
        const number = getRandomInt(treasuresInDb.length - 1)
        const treasure = treasuresInDb[number]
        treasures.push({id:i,posX:getRandomInt(width),posY:getRandomInt(height),image:treasure.image,value:treasure.score})
    }

   return treasures
}


