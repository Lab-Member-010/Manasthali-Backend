import jwt from 'jsonwebtoken';  // Add this import

// Inside your connection handler (io.on('connection'))
io.on('connection', (socket) => {
  const token = socket.handshake.query.token;  // Get token from query params

  if (!token) {
    socket.disconnect();
    return;
  }

  jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
    if (err) {
      socket.disconnect();
      return;
    }
    socket.user = user;  // Attach user to socket object

    console.log('User connected: ', user);

    // Handle send-message and other events
    socket.on('send-message', (data) => {
      io.to(data.receiverId).emit('receive-message', data);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
});
