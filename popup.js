document.addEventListener("DOMContentLoaded", () => {
    console.log("Popup DOM is fully loaded");

    const analyzeButton = document.getElementById("analyze");
    console.log("analyzeButton = ", analyzeButton)
    if (!analyzeButton) {
        console.error("Analyze button not found!");
        return;
    }

    analyzeButton.addEventListener("click", () => {
        console.log("Analyze button clicked");

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            console.log("Tabs query completed");
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "analyzeImage" },
                (response) => {
                    console.log("Response from content script:", response);
                    if (response?.imageUrl) {
                        chrome.tabs.sendMessage(
                            tabs[0].id,
                            { action: "processImage", imageUrl: response.imageUrl },
                            (result) => {
                                const output = document.getElementById("output");
                                if (result.success) {
                                    output.textContent = `Description: ${result.description}`;
                                } else {
                                    output.textContent = `Error: ${result.error}`;
                                }
                            }
                        );
                    } else {
                        alert(response.error || "Failed to find the product image.");
                    }
                }
            );
        });
    });
});
