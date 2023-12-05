// Socket io imports
import { Server } from "socket.io";

// Initialize a server and allow cors for client side
const io = new Server({
	cors: {
		origin: "http://localhost:5173",
	},
});

// Start server
io.listen(3500);

// Create the characters array
const characters = [];

// Helper functions
const generateRandomPosition = () => [Math.random() * 3, 0, Math.random() * 3];
const generateRandomHexColor = () =>
	"#" + Math.floor(Math.random() * 16777215).toString(16);

// Establish connection and disconnection actions
io.on("connection", (socket) => {
	console.log("User connected!");

	characters.push({
		id: socket.id,
		position: generateRandomPosition(),
		hairColor: generateRandomHexColor(),
		topColor: generateRandomHexColor(),
		bottomColor: generateRandomHexColor(),
	});

	socket.emit("hello");

	io.emit("characters", characters);

	// Function to move character to new position
	socket.on("move", (position) => {
		const character = characters.find(
			(character) => character.id === socket.id
		);
		character.position = position;
		io.emit("characters", characters);
	});

	// Function for chat messages
	socket.on("chatMessage", (message) => {
		io.emit("playerChatMessage", {
			id: socket.id,
			message,
		});
	});

	socket.on("disconnect", () => {
		console.log("User disconnected!");

		// Remove character from array when disconnected
		characters.splice(
			characters.findIndex((character) => character.id === socket.id),
			1
		);

		io.emit("characters", characters);
	});
});
