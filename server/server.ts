import { createServer } from 'node:http';
        import { Server } from 'socket.io';
        import type { Socket } from 'socket.io';

        interface Room {
            roomId: string;
            users: string[];
        }

        const httpServer = createServer();
        const io = new Server(httpServer, {
            cors: {
                origin: process.env.NODE_ENV === 'production'
                    ? 'https://your-domain.com'
                    : 'http://localhost:3000',
                methods: ['GET', 'POST']
            }
        });

        const rooms = new Map<string, Room>();

        io.on('connection', (socket: Socket) => {
            console.log('User connected:', socket.id);

            socket.on('join-room', (roomId: string) => {
                socket.join(roomId);

                if (!rooms.has(roomId)) {
                    rooms.set(roomId, { roomId, users: [] });
                }

                const room = rooms.get(roomId)!;
                room.users.push(socket.id);

                console.log(`User ${socket.id} joined room ${roomId}`);
                io.to(roomId).emit('user-joined', socket.id);
            });

            socket.on('offer', (offer: RTCSessionDescriptionInit, roomId: string) => {
                socket.to(roomId).emit('offer', offer, socket.id);
            });

            socket.on('answer', (answer: RTCSessionDescriptionInit, roomId: string) => {
                socket.to(roomId).emit('answer', answer, socket.id);
            });

            socket.on('ice-candidate', (candidate: RTCIceCandidate, roomId: string) => {
                socket.to(roomId).emit('ice-candidate', candidate, socket.id);
            });

            socket.on('disconnect', () => {
                console.log('User disconnected:', socket.id);

                for (const [roomId, room] of rooms) {
                    const index = room.users.indexOf(socket.id);
                    if (index !== -1) {
                        room.users.splice(index, 1);
                        io.to(roomId).emit('user-left', socket.id);

                        if (room.users.length === 0) {
                            rooms.delete(roomId);
                        }
                    }
                }
            });
        });

        const PORT = process.env.PORT || 3001;
        httpServer.listen(PORT, () => {
            console.log(`Signaling Server running on port ${PORT}`);
        });