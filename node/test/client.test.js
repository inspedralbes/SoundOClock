import { expect } from 'chai';
import { io as ioClient } from 'socket.io-client';

describe('Socket.IO Server', () => {
  let clientSocket;

  before((done) => {
    const serverAddr = `http://localhost:8080`;
    clientSocket = ioClient(serverAddr);
    clientSocket.on('connect', done);
  });

  after(() => {
    clientSocket.close();
  });

  it('should communicate with the socket server', (done) => {
    clientSocket.on('testing', (message) => {
      expect(message).to.equal('bitches be crazy');
      done();
    });

    clientSocket.emit('testing', 'bitches be crazy');
  });
});
