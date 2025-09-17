import OpenAI from "openai";
const openai = new OpenAI()

const findVectorStore = async ({lessonId}:{lessonId:string}) => {
    let vectorStore
    vectorStore = await openai.vectorStores.retrieve(
        lessonId
    );

    if (!vectorStore){
         vectorStore = await openai.vectorStores.create({
            name:lessonId
        })
    }
    
    return vectorStore
}




