import Prompt from "@/models/prompt";
import { connectToDB } from "@/utils/database";

interface Prompt {
    userId: string;
    prompt: string;
    tag: string
}

export const POST = async (req: Request, res: Response) => {
    const body: any = await req.json();
    try {
        await connectToDB();
        const prompt = new Prompt({
            creator: body?.userId,
            tag: body?.tag,
            prompt: body?.prompt
        })

        await prompt.save();

        return new Response(JSON.stringify(prompt), {status: 201})
    } catch (error) {
        console.log('Error ', error)
        return new Response('Failed to Create Prompt', { status: 500})
    }
}