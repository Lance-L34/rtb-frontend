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
    const amount = parseInt(bet);
    if (amount > 0 && amount <= balance) {
      socket.emit('placeBet', { room, username, bet: amount });
      setBalance(balance - amount);
    }
  };

  const makeGuess = (guess) => {
    socket.emit('guess', { room, username, guess, step });
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      {!inRoom ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Join or Create a Room</h1>
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
          <button className="bg-blue-600 text-white p-2 rounded w-full" onClick={joinRoom}>
            Join / Create Room
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Room: {room}</h2>
          <p className="text-gray-700">Balance: ${balance}</p>
          <p className="text-sm text-gray-500">Players: {players.join(', ')}</p>

          <input
            type="number"
            className="border p-2 w-full"
            placeholder="Place your bet"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
          />
          <button className="bg-green-600 text-white p-2 rounded w-full" onClick={placeBet}>
            Submit Bet
          </button>
          <button className="bg-purple-600 text-white p-2 rounded w-full" onClick={startGame}>
            Start Game
          </button>

          {yourTurn && (
            <div className="mt-4 space-y-2">
              <h3 className="text-lg">Current Card: {card}</h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => makeGuess('red')} className="bg-red-500 text-white p-2 rounded">Red</button>
                <button onClick={() => makeGuess('black')} className="bg-black text-white p-2 rounded">Black</button>
                <button onClick={() => makeGuess('higher')} className="bg-blue-500 text-white p-2 rounded">Higher</button>
                <button onClick={() => makeGuess('lower')} className="bg-blue-800 text-white p-2 rounded">Lower</button>
                <button onClick={() => makeGuess('inside')} className="bg-yellow-500 text-white p-2 rounded">Inside</button>
                <button onClick={() => makeGuess('outside')} className="bg-yellow-700 text-white p-2 rounded">Outside</button>
                <button onClick={() => makeGuess('spade')} className="bg-gray-700 text-white p-2 rounded">Spade</button>
                <button onClick={() => makeGuess('heart')} className="bg-pink-500 text-white p-2 rounded">Heart</button>
                <button onClick={() => makeGuess('club')} className="bg-green-600 text-white p-2 rounded">Club</button>
                <button onClick={() => makeGuess('diamond')} className="bg-indigo-500 text-white p-2 rounded">Diamond</button>
              </div>
            </div>
          )}

          <p className="mt-4 text-center text-lg text-purple-800">{message}</p>
        </div>
      )}
    </div>
  );
}

