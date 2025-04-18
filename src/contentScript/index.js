import { Interpreter } from "eval5"

const interpreter = new Interpreter(window, {});
window.addEventListener('load', async () => {
  chrome.runtime.sendMessage({
    action: "executeScript",
    location: JSON.stringify(window.location)
  }, (response) => {
  
    try {
      if (response) {
        const scripts = JSON.parse(response);
        scripts.forEach((item) => {
          item.es5Script && interpreter.evaluate(item.es5Script);
        })
      }
    } catch (error) {
      console.log(error)
    }
  });
})