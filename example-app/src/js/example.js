import { YueFlashlight } from 'yue-flashlight';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    YueFlashlight.echo({ value: inputValue })
}
