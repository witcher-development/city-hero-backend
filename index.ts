import {Db, MongoClient, ObjectId} from "mongodb"
import fastify from "fastify";
import cors from '@fastify/cors'

const client = new MongoClient('mongodb://admin:admin@localhost:27017/')

type Task = {
    name: string
    description: string
    score: number
}

type Goal = {
    name: string
    progress: number
    tasks: Task[]
}

const getDB = () => client.db('cityhero')
const getGoalCollection = () => getDB().collection<Goal>('goal')



const server = fastify({ logger: false })

server.get('/goal', async (request, reply) => {
    const goalCollection = getGoalCollection()

    const goals = await goalCollection.find({}).toArray()

    reply.code(200).send(goals)
})

server.get('/goal/:id', async (request, reply) => {
    const goalCollection = getGoalCollection()

    const id = request.params.id as string
    const goals = await goalCollection.findOne({ _id: new ObjectId(id) })

    reply.code(200).send(goals)
})

server.post('/goal', async (request, reply) => {
    const goalCollection = getGoalCollection()

    const goal = request.body as Goal

    await goalCollection.insertOne(goal)

    reply.code(200).send('hi')
})

const main = async () => {
    try {
        await server.register(cors)
        await server.listen(3001)
    } catch (err) {
        server.log.error(err)
        process.exit(1)
    }
}
main()

server.addHook('preClose', async () => {
    console.log('haasdasdadasd')
    await client.close()
})
// const server = Bun.serve({
//     port: 3001,
//     async fetch(request) {
//         const { db, close } = getDB()
//
//         try {
//             const { pathname } = new URL(request.url)
//
//             if (pathname.includes("/goal")) {
//                 return await goalRouter(request.method, db)
//             } else if (pathname.includes("/task")) {
//
//             }
//
//             // const goals = db.collection('goals')
//             // const all = await goals.find()
//
//             // return new Response(JSON.stringify(await all.toArray()))
//             return new Response()
//         } finally {
//             close()
//         }
//     },
// });
