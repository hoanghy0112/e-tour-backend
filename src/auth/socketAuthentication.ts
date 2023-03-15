import { Socket } from "socket.io";

async function authenticateUser(socket: Socket) {
  const token = socket.handshake.auth.token;
}

export default {
  authenticateUser
}