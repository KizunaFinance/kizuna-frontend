import client from "../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const db = client.db(process.env.MONGODB_DB);
        const movies = await db.collection("test").insertOne({ name: "test" });
        res.json(movies);
    } catch (e) {
        console.error(e);
    }
}