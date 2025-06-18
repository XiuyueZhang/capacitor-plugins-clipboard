import { YueClipboard } from 'yue-clipboard';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    YueClipboard.echo({ value: inputValue });
};

window.testClipboard = () => {
    // Test writing text to clipboard
    YueClipboard.write({ string: "Hello from Yue Clipboard!" })
        .then(() => console.log('Text written to clipboard'))
        .catch(err => console.error('Failed to write to clipboard:', err));
};

window.testReadClipboard = () => {
    // Test reading from clipboard
    YueClipboard.read()
        .then(result => {
            console.log('Clipboard content:', result);
            alert(`Clipboard contains: ${result.value} (type: ${result.type})`);
        })
        .catch(err => console.error('Failed to read from clipboard:', err));
};

window.testClearClipboard = () => {
    // Test clearing clipboard
    YueClipboard.clear()
        .then(() => {
            console.log('Clipboard cleared');
            alert('Clipboard cleared!');
        })
        .catch(err => console.error('Failed to clear clipboard:', err));
};

window.testHasContent = () => {
    // Test checking if clipboard has content
    YueClipboard.hasContent()
        .then(result => {
            console.log('Clipboard has content:', result.hasContent);
            alert(`Clipboard has content: ${result.hasContent}`);
        })
        .catch(err => console.error('Failed to check clipboard content:', err));
};

window.testGetTypes = () => {
    // Test getting available content types
    YueClipboard.getAvailableTypes()
        .then(result => {
            console.log('Available types:', result.types);
            alert(`Available types: ${result.types.join(', ')}`);
        })
        .catch(err => console.error('Failed to get types:', err));
};
