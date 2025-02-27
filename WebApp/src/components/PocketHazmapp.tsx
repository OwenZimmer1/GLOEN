import React, { useEffect } from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'langflow-chat': React.HTMLAttributes<HTMLDivElement> & {
        window_title?: string;
        flow_id?: string;
        host_url?: string;
      };
    }
  }
}


const PocketHazmapp: React.FC = () => {
  useEffect(() => {
    // Function to load the Langflow chat script
    const loadLangflowChat = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // The script is loaded, now you can be sure that langflow-chat component is defined
        console.log("Langflow Chat script loaded successfully");
      };

      script.onerror = () => {
        console.error("Failed to load Langflow Chat script");
      };
    };

    // Call the function to load the script when the component mounts
    loadLangflowChat();

    // Cleanup function to remove the script when the component unmounts (optional)
    return () => {
      const script = document.querySelector('script[src="https://cdn.jsdelivr.net/gh/logspace-ai/langflow-embedded-chat@v1.0.7/dist/build/static/js/bundle.min.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div>
      <h1>Pocket Hazmapp Coming Soon....</h1>
      <langflow-chat
        window_title="GPT4o mini HF (stable)"
        flow_id="4fc357e8-b350-4dab-944b-6f414f16f14d"
        host_url="https://eyas1-lang-flow1.hf.space/"
      ></langflow-chat>
    </div>
  );
};

export default PocketHazmapp;