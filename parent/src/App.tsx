import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [url, setUrl] = useState("")

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the message origin
      // if (event.origin !== 'http://localhost:5174') return;
      console.log(`parent event.origin: ${event.origin}`);
      console.log('Received message from iframe:', event.data);

      const { type } = event.data;

      if (type === "url") {
        const { url } = event.data;
        setUrl(url)
      }

      if (type === "add") {
        const { componentHierarchy, changeMessage } = event.data;
        console.log("componentHierarchy", componentHierarchy)
        console.log("changeMessage", changeMessage)
      }

      // Increment the counter
      setCount(prevCount => prevCount + 1);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const sendMessageToIframe = () => {
    console.log('Sending message to iframe');
    const iframe = document.getElementById('iframe-id') as HTMLIFrameElement;
    console.log(iframe.contentWindow?.postMessage);
    iframe.contentWindow?.postMessage({ type: 'GREETING', text: 'Hello from parent' }, '*');
  };

  const load = () => {
    var iframe = document.getElementById('iframe-id') as HTMLIFrameElement;
    var iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDocument) {
      console.error('iframeDocument is null');
      return;
    }

    var scriptSource = `
        window.addEventListener('DOMContentLoaded', function() {
            var form = document.getElementById('form'); // change to the actual form selector
            var input = document.getElementById('transaction_amount');
            input.value = 100;

            form.addEventListener('submit', function (ev) {
                if (Number(input.value) > 100) {
                    alert('No chance');
                    ev.preventDefault();
                }
            });
        });
    `;
    var script = iframeDocument.createElement("script");
    var source = iframeDocument.createTextNode(scriptSource);
    script.appendChild(source);
    iframeDocument.body.appendChild(script);
  }

  const handleSelectComponent = () => {
    var iframe = document.getElementById('iframe-id') as HTMLIFrameElement;
    iframe?.contentWindow?.postMessage(
      { type: "select_component", enabled: true },
      "*",
    );
  };

  return (
    <>
      <iframe id="iframe-id" src="http://localhost:8081" onLoad={load} />
      <button onClick={sendMessageToIframe}>Send Message to Iframe</button>
      <button onClick={handleSelectComponent}>Select Component</button>
      <p>Message count: {count}</p> {/* Display the counter */}
      <p>URL: {url}</p>
    </>
  )
}

export default App
