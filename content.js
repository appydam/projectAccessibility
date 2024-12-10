
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("we are here bro")
    console.log("request = ", request)
    if (request.action === "analyzeImage") {

        // Find the element with the class 'imgTagWrapper'
        // TODO: Need to Fetch image Class Dynamically
        const wrapper = document.querySelector(".imgTagWrapper");

        // Get the image inside the wrapper
        const productImage = wrapper ? wrapper.querySelector("img") : null;

        console.log("url = ", productImage.src)
        if (productImage && productImage.src) {
            console.log("in that ifff")
            sendResponse({ imageUrl: productImage.src });
            console.log("still here")
        } else {
            sendResponse({ error: "No product image found within the 'imgTagWrapper' class." });
        }
    }
});
