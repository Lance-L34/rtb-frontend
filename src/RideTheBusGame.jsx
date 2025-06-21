import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
const socket = io("https://rtb-backend1.onrender.com");

export default function RideTheBusGame() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [inRoom, setInRoom] = useState(false);
  const [players, setPlayers] = useState([]);
  const [bet, setBet] = useState('');
  const [balance, setBalance] = useState(100);
  const [step, setStep] = useState(0);
  const [card, setCard] = useState(null);
  const [message, setMessage] = useState('');
  const [yourTurn, setYourTurn] = useState(false);

  useEffect(() => {
    socket.on('roomJoined', ({ players }) => {
      setPlayers(players);
      setInRoom(true);
    });

    socket.on('updatePlayers', setPlayers);

    socket.on('startTurn', ({ card, step }) => {
      setYourTurn(true);
      setCard(card);
      setStep(step);
      setMessage(`Step ${step + 1}: Make your guess.`);
    });

    socket.on('turnResult', ({ success, payout, message, newBalance }) => {
      setMessage(message);
      if (success) setBalance(newBalance);
      setYourTurn(false);
    });
  }, []);

  const joinRoom = () => {
    if (username && room) {
      socket.emit('joinRoom', { username, room });
    }
  };

  const startGame = () => {
    socket.emit('startGame', { room });
  };

  const placeBet = () => {
    socket.emit('placeBet', { room, username, bet: parseInt(bet) });
    setBalance(balance - parseInt(bet));
  };

  const makeGuess = (guess) => {
    socket.emit('guess', { room, username, guess, step });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      {!inRoom ? (
        <div className="space-y-4">
          <h1 className="text-xl font-bold">Join Ride the Bus</h1>
          <input
            className="border p-2 w-full"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="border p-2 w-full"
            placeholder="Room Code"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button className="bg-blue-500 text-white p-2 rounded" onClick={joinRoom}>
            Join Room
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Room: {room}</h2>
          <p>Balance: ${balance}</p>
          <p className="font-mono">Players: {players.join(', ')}</p>

          <div className="space-y-2">
            <input
              type="number"
              className="border p-2 w-full"
              placeholder="Place your bet"
              value={bet}
              onChange={(e) => setBet(e.target.value)}
            />
            <button className="bg-green-600 text-white p-2 rounded" onClick={placeBet}>
              Submit Bet
            </button>
            <button className="bg-purple-500 text-white p-2 rounded" onClick={startGame}>
              Start Game
            </button>
          </div>

          {yourTurn && (
            <div className="mt-4">
              <h3 className="text-xl">Current Card: {card}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button onClick={() => makeGuess('red')} className="bg-red-400 p-2 rounded text-white">Red</button>
                <button onClick={() => makeGuess('black')} className="bg-black p-2 rounded text-white">Black</button>
                <button onClick={() => makeGuess('higher')} className="bg-blue-500 p-2 rounded text-white">Higher</button>
                <button onClick={() => makeGuess('lower')} className="bg-blue-800 p-2 rounded text-white">Lower</button>
                <button onClick={() => makeGuess('inside')} className="bg-yellow-500 p-2 rounded text-white">Inside</button>
                <button onClick={() => makeGuess('outside')} className="bg-yellow-700 p-2 rounded text-white">Outside</button>
                <button onClick={() => makeGuess('spade')} className="bg-gray-600 p-2 rounded text-white">Spade</button>
                <button onClick={() => makeGuess('heart')} className="bg-pink-500 p-2 rounded text-white">Heart</button>
                <button onClick={() => makeGuess('club')} className="bg-green-600 p-2 rounded text-white">Club</button>
                <button onClick={() => makeGuess('diamond')} className="bg-indigo-400 p-2 rounded text-white">Diamond</button>
              </div>
            </div>
          )}

          <p className="mt-4 text-lg text-center">{message}</p>
        </div>
      )}
    </div>
  );
}