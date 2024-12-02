const receivedEvents=new Set()
const serverIp = `wss://newwebsocketserver.onrender.com`;  //Change with your hosted url or Localhost
const websocket = new WebSocket(serverIp); // Create WebSocket connection

websocket.addEventListener("open", () => {
  console.log("WebSocket connection established.");
});

websocket.addEventListener("error", (error) => {
  console.error("There was an error in the WebSocket Connection:", error);
});

websocket.addEventListener("close", () => {
  console.log("WebSocket connection closed.");
});

// Ensure the WebSocket connection is open before sending data
function sendMessage(message) {
  if (websocket.readyState === WebSocket.OPEN) {
    websocket.send(JSON.stringify(message));
    console.log("Sent message:", message);
  } else {
    console.error("WebSocket is not open, retrying...");
    setTimeout(() => sendMessage(message), 1000);  // Retry sending after 1 second
  }
}

// Client-side: Receive messages
websocket.addEventListener("message", ({ data }) => {
  const notificationArea = document.getElementById("Notification");
  const imageContainer = document.getElementById("display_image");
  const messageContainer = document.getElementById("receivedMessage");
  const dateContainer = document.getElementById("receivedDate");
  const confidenceContainer = document.getElementById("receivedConfidence")
  //console.log("Received raw data:", data);  // This will print the raw data received

  try {
    
    const event = JSON.parse(data);
    receivedEvents.add(event)
    //console.log("Received event:", event);

    if (event.yolo_class_id !== undefined) {
      // console.log("YOLO class detected");
      confidenceContainer.innerText=`The confidence of the Model is : ${event.confidence}`
      messageContainer.innerText = `You received a Message: ${event.message}`;
      dateContainer.innerText = `The time of the Frame Is: ${event.frame_time}`;
      notificationArea.style.display = "block";
      imageContainer.style.display = "none";  // Modify this to show an image if required
    } else {
      // Handle regular messages or fallback response
      messageContainer.innerHTML = event.message || "No message";
      dateContainer.innerHTML = "";
      notificationArea.style.display = "block";
      imageContainer.style.display = "none";
    }
    if (event.frame_image) {
      //console.log("THE YOLO SENT AN IMAGE")
      const base64Image = `data:image/jpg;base64,${event.frame_image}`;

      imageContainer.src = base64Image; 
      imageContainer.style.display = "block";  
      notificationArea.style.display = "none"; 
    } else {
      imageContainer.style.display = "none";  
      notificationArea.style.display = "block"; 
    }
  } catch (e) {
    console.error("Error parsing message:", e);
  }
  console.log(Array.from(receivedEvents))
});


