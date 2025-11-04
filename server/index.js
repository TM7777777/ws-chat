const WebSocket = require('ws');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

class ChatServer {
  constructor() {
    this.server = http.createServer();
    this.wss = new WebSocket.Server({ server: this.server });
    this.clients = new Map();
    this.rooms = new Map();
    this.roomMessages = new Map();

    this.initializeDefaultRooms();
    this.setupWebSocketHandlers();
  }

  initializeDefaultRooms() {
    const defaultRooms = [
      { name: 'General', description: 'General discussion' },
      { name: 'Random', description: 'Random chat' },
      { name: 'Tech', description: 'Technology discussions' },
    ];

    defaultRooms.forEach((roomData) => {
      const room = {
        id: uuidv4(),
        name: roomData.name,
        description: roomData.description,
        clients: new Set(),
        createdAt: new Date(),
      };
      this.rooms.set(room.id, room);
      this.roomMessages.set(room.id, []);
    });
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', (ws) => {
      const clientId = uuidv4();
      const client = {
        ws,
        id: clientId,
      };

      this.clients.set(clientId, client);
      console.log(`New client connected: ${clientId}`);

      this.sendToClient(clientId, {
        type: 'rooms_list',
        payload: this.getRoomsList(),
      });

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      });

      ws.on('close', () => {
        this.handleClientDisconnect(clientId);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
        this.handleClientDisconnect(clientId);
      });
    });
  }

  handleMessage(clientId, message) {
    const client = this.clients.get(clientId);
    if (!client) return;

    switch (message.type) {
      case 'get_rooms':
        this.sendToClient(clientId, {
          type: 'rooms_list',
          payload: this.getRoomsList(),
        });
        break;

      case 'create_room':
        this.handleCreateRoom(clientId, message.payload);
        break;

      case 'join_room':
        this.handleJoinRoom(clientId, message.payload);
        break;

      case 'leave_room':
        this.handleLeaveRoom(clientId);
        break;

      case 'send_message':
        this.handleSendMessage(clientId, message.payload);
        break;

      default:
        console.warn(`Unknown message type: ${message.type}`);
    }
  }

  handleCreateRoom(clientId, payload) {
    const room = {
      id: uuidv4(),
      name: payload.name,
      description: payload.description,
      clients: new Set(),
      createdAt: new Date(),
    };

    this.rooms.set(room.id, room);
    this.roomMessages.set(room.id, []);

    this.broadcastToAll({
      type: 'rooms_list',
      payload: this.getRoomsList(),
    });

    console.log(`Room created: ${room.name} (${room.id})`);
  }

  handleJoinRoom(clientId, payload) {
    const client = this.clients.get(clientId);
    const room = this.rooms.get(payload.roomId);

    if (!client || !room) return;

    if (client.currentRoom) {
      this.handleLeaveRoom(clientId);
    }

    client.currentRoom = payload.roomId;
    client.username = payload.username;
    room.clients.add(clientId);

    this.sendToClient(clientId, {
      type: 'room_joined',
      payload: {
        roomId: room.id,
        roomName: room.name,
      },
    });

    const roomMessageHistory = this.roomMessages.get(payload.roomId) || [];
    if (roomMessageHistory.length > 0) {
      this.sendToClient(clientId, {
        type: 'message_history',
        payload: roomMessageHistory,
      });
    }

    if (payload.username) {
      this.broadcastToRoom(
        payload.roomId,
        {
          type: 'user_joined',
          payload: {
            username: payload.username,
            roomId: payload.roomId,
          },
        },
        [clientId],
      );
    }

    this.broadcastToAll({
      type: 'rooms_list',
      payload: this.getRoomsList(),
    });

    console.log(`Client ${clientId} (${payload.username}) joined room ${room.name}`);
  }

  handleLeaveRoom(clientId) {
    const client = this.clients.get(clientId);
    if (!client || !client.currentRoom) return;

    const room = this.rooms.get(client.currentRoom);
    if (room) {
      room.clients.delete(clientId);

      if (client.username) {
        this.broadcastToRoom(
          client.currentRoom,
          {
            type: 'user_left',
            payload: {
              username: client.username,
              roomId: client.currentRoom,
            },
          },
          [clientId],
        );
      }

      this.broadcastToAll({
        type: 'rooms_list',
        payload: this.getRoomsList(),
      });
    }

    client.currentRoom = undefined;
    client.username = undefined;
    console.log(`Client ${clientId} left room`);
  }

  handleSendMessage(clientId, payload) {
    const client = this.clients.get(clientId);
    if (!client || client.currentRoom !== payload.roomId) return;

    if (!payload.text || payload.text.trim().length === 0) {
      this.sendToClient(clientId, {
        type: 'error',
        payload: { message: 'Message cannot be empty' },
      });
      return;
    }

    if (payload.text.length > 255) {
      this.sendToClient(clientId, {
        type: 'error',
        payload: { message: 'Message cannot exceed 255 characters' },
      });
      return;
    }

    const message = {
      id: uuidv4(),
      text: payload.text.trim(),
      username: payload.username,
      timestamp: new Date().toISOString(),
      roomId: payload.roomId,
    };

    const roomHistory = this.roomMessages.get(payload.roomId) || [];
    roomHistory.push(message);
    if (roomHistory.length > 10) {
      roomHistory.shift();
    }
    this.roomMessages.set(payload.roomId, roomHistory);

    this.broadcastToRoom(payload.roomId, {
      type: 'message_received',
      payload: message,
    });

    console.log(`Message sent in room ${payload.roomId}: ${payload.username}: ${payload.text}`);
  }

  handleClientDisconnect(clientId) {
    const client = this.clients.get(clientId);
    if (client) {
      if (client.currentRoom) {
        this.handleLeaveRoom(clientId);
      }
      this.clients.delete(clientId);
    }
    console.log(`Client disconnected: ${clientId}`);
  }

  sendToClient(clientId, data) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  }

  broadcastToRoom(roomId, data, excludeClients = []) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.clients.forEach((clientId) => {
      if (!excludeClients.includes(clientId)) {
        this.sendToClient(clientId, data);
      }
    });
  }

  broadcastToAll(data) {
    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(data));
      }
    });
  }

  getRoomsList() {
    return Array.from(this.rooms.values()).map((room) => ({
      id: room.id,
      name: room.name,
      description: room.description,
      clientCount: room.clients.size,
    }));
  }

  start(port = 8080) {
    this.server.listen(port, () => {
      console.log(`WebSocket Chat Server is running on port ${port}`);
      console.log(
        `Available rooms: ${Array.from(this.rooms.values())
          .map((r) => r.name)
          .join(', ')}`,
      );
    });
  }
}

const server = new ChatServer();
server.start(process.env.PORT ? parseInt(process.env.PORT) : 8080);
