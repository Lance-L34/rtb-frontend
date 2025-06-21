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

  return (
    <div>
      <h1>Ride the Bus</h1>
      <p>Game interface will go here.</p>
    </div>
  );
}
