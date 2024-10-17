import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify the message origin
      if (event.origin !== 'http://localhost:5174') return;

      // Handle the message
      console.log('Received message from iframe:', event.data);

      // Increment the counter
      setCount(prevCount => prevCount + 1);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const sendMessageToIframe = () => {
    const iframe = document.getElementById('iframe-id') as HTMLIFrameElement;
    iframe.contentWindow?.postMessage({ type: 'GREETING', text: 'Hello from parent' }, 'http://localhost:5174');
  };

  return (
    <>
      <iframe id="iframe-id" src="http://localhost:5174" />
      <button onClick={sendMessageToIframe}>Send Message to Iframe</button>
      <p>Message count: {count}</p> {/* Display the counter */}
    </>
  )
}

export default App
