import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch , { Headers, Request, Response } from 'node-fetch';

if (!globalThis.fetch) globalThis.fetch = fetch;
if (!globalThis.Headers) globalThis.Headers = Headers;
if (!globalThis.Request) globalThis.Request = Request;
if (!globalThis.Response) globalThis.Response = Response;

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

export default genAI;
