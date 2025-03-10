export async function getCurrentTab() {
    let queryOptions = {currentWindow: true, active: true};
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}


