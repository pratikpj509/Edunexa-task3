import React, { useEffect, useState } from 'react'
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client'
import './chat.css'
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

const socket = io.connect("http://localhost:5000")

const Chat = () => {
    const location = useLocation();

    const [name, setName] = useState('');
    const [room, setRoom] = useState(' ');
    const [users, setUsers] = useState('')
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([])


    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {

        });

        return () => {

            socket.off();
        }
    }, [location.search])



    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message])
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        })
    }, [messages])

    const sendMessage = (event) => {
        event.preventDefault();

        if (message) {
            socket.emit('sendMessage', message, () => setMessage(''))
        }
    }

    console.log(message, messages)


    return (
        <div className='outerContainer'>
            <div className='container'>
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={users} />
        </div>
    )
}

export default Chat