
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    console.log("we are in backgroung")
    console.log(request)
    if (request.action === "processImage") {
        try {
            const { imageUrl } = request;
            const description = await getAIAnalysis(imageUrl);
            console.log(description)

            // Use browser's Text-to-Speech (TTS) feature
            speakText(description);
            sendResponse({ success: true, description });
        } catch (error) {
            console.log(error);
            sendResponse({ success: false, error: error.message });
        }
    }
    return true; // Required to indicate asynchronous response
});

async function getBase64Image(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer(); // Use arrayBuffer() to get the response
    const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
    return buffer.toString('base64'); // Convert buffer to Base64 string
}

async function getAIAnalysis(imageUrl) {

    //TODO : if in future need to use ChatGPT

    // console.log("in getAIAnalysis func")
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": `Bearer process.env.OPENAI_API_KEY`
    //     },
    //     body: JSON.stringify({
    //         model: "gpt-4o-mini",
    //         messages: [
    //             {
    //                 role: "user",
    //                 content: [
    //                     {
    //                         type: "text",
    //                         text: "What’s in this image?"
    //                     },
    //                     {
    //                         type: "image_url",
    //                         image_url: {
    //                             url: imageUrl // Use the provided image URL
    //                         }
    //                     }
    //                 ]
    //             }
    //         ],
    //         max_tokens: 300 // Adjust max tokens as needed
    //     })
    // });

    // if (!response.ok) {
    //    console.log(response)
    // }


    // const data = await response.json();
    // return data.choices[0].message.content; // Adjust based on API response structure

    const model = "Salesforce/blip-image-captioning-large"; // Image Captioning Model

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer process.env.HUGGINGFACE_API_KEY`, // Replace with your actual API key
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: imageUrl }) // Directly pass the image URL
    });

    const data = await response.json();
    if (data && data[0] && data[0].generated_text) {
        return data[0].generated_text;
    } else {
        return "";
    }

    /*const base64Image = await getBase64Image(imageUrl); // Get Base64 image

    const request = JSON.stringify({
        contents: [{
            parts: [
                { text: "Caption this image." },
                {
                    inline_data: {
                        mime_type: "image/jpeg",
                        data: base64Image// Directly use the public image URL
                    }
                }
            ]
        }]
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC12rxeKolf0T33-w9alPFyJfITHt58_dg`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: request
    });

    const data = await response.json();
    console.log(data)

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return data;*/

}

//TODO: Need to change the text to voice model
function speakText(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
}