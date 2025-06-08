export const animationStyles = `
  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }
  
  @keyframes slowBlink {
    0% {
      opacity: 1;
    }
    30% {
      opacity: 0.4;
    }
    70% {
      opacity: 0.7;
    }
    100% {
      opacity: 1;
    }
  }
  
  @keyframes shakeDown {
    0%, 100% {
      transform: translateY(0px);
    }
    25% {
      transform: translateY(-8px);
    }
    50% {
      transform: translateY(4px);
    }
    75% {
      transform: translateY(-4px);
    }
  }
  
  @keyframes particleFloat {
    0% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: scale(0) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes slideDown {
    0% {
      transform: translateX(-50%) translateY(-20px);
      opacity: 0;
    }
    100% {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes cloClick {
    0% {
      transform: translateX(-50%) scale(1) rotate(0deg);
    }
    50% {
      transform: translateX(-50%) scale(1.3) rotate(10deg);
    }
    100% {
      transform: translateX(-50%) scale(1) rotate(0deg);
    }
  }
  
  .bounce {
    animation: bounce 2s infinite;
  }
  
  .slow-blink {
    animation: slowBlink 3s infinite ease-in-out;
  }
  
  .shake-down {
    animation: shakeDown 1.5s infinite ease-in-out;
  }
  
  .particle {
    animation: particleFloat 2s ease-out forwards;
  }
  
  .mouse-follower {
    pointer-events: none;
    mix-blend-mode: difference;
  }
  
  .interactive-image:hover {
    transform: scale(1.02);
    filter: brightness(1.1) contrast(1.1);
  }
  
  .interactive-image {
    transition: transform 0.3s ease, filter 0.3s ease;
    cursor: pointer;
  }
  
  .clo-clicked {
    animation: cloClick 0.3s ease-out;
  }
  
  .clo-interactive {
    cursor: pointer;
    transition: filter 0.2s ease;
  }
  
  .clo-interactive:hover {
    filter: drop-shadow(0 8px 20px rgba(37,99,235,0.3)) brightness(1.1);
  }
`; 