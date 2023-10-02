import { MongoClient } from "mongodb";
import dotenv from 'dotenv'
dotenv.config();
console.log(process.env.MONGODBURI)
const client= new MongoClient(process.env.MONGODBURI,              {useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: { w: "majority" }})
async function dbo(){
    let db;
    try{
        await client.connect();
        db=client.db('interior')
        console.log('database connected!!!')
        return db
    }
    catch{
        console.log(error)
    }
}
export default dbo;
export {client}