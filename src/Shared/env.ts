import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
    DATABASE_URI : z.string(),
    DATABASE_NAME : z.string(),
    PORT : z.string().default("5000").transform((value)=>Number(value)),
    OPENAI_API_KEY : z.string().min(1,'Api key missing')
});

const parsed = EnvSchema.safeParse(process.env);

if(!parsed.success){
    console.log('Loading env error....');
    process.exit(1);
}

export const env = Object.freeze(parsed.data);