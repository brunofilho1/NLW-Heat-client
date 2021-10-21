import {api} from '../../services/api';
import io from 'socket.io-client';
import styles from './styles.module.scss';
import logoImg from '../../assets/logo.svg';
import { useEffect, useState } from 'react';


type Message = {
    id: string,
    text: string,
    user: {
        name: string,
        avatar_url: string
    }
};

const messagesQueue: Message[] = [];

const socket = io('http://localhost:4000');

socket.on('new_message', newMessage => {
    messagesQueue.push(newMessage)
});

export function MessageList() {

    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        const timer = setInterval(() => {
            if(messagesQueue.length > 0) {
                setMessages(prevState => [ //prevState = recebe o valor anterior, as mensagens antes de atualizar e assim retorna o novo array
                    messagesQueue[0],
                    prevState[0],
                    prevState[1],
                ].filter(Boolean)) // filtrar o array pra tirar os "falses"/"undefined"/"null", caso algum message retornar null ou undefined ele vai retirar da lista pra não atrapalhar
            
                messagesQueue.shift() //remover o mais antigo da lista de mensagens

            }
        }, 3000)
    }, [])

    useEffect(() => { // um hook que recebe 2 parâmetros: a função que eu quero executar, e QUANDO ela deve ser executada passando uma variável,//que quando alterada, ativa a função, ou deixa vazio pra executar apenas no carregamento da página
        api.get<Message[]>('messages/last3').then(response => {
            setMessages(response.data)
        })
    }, []) 
                            
    return (
        <div className={styles.messageListWrapper}>
            <img src={logoImg} alt="DoWhile 2021" />

            <ul className={styles.messageList}>

                {messages.map(message => {
                    return (
                        <li key={message.id} className={styles.message}>
                            <p className={styles.messageContent}>{message.text}</p>
                            <div className={styles.messageUser}>
                                <div className={styles.userImage}>
                                    <img src={message.user.avatar_url} alt={message.user.name} />
                                </div>
                                <span>{message.user.name}</span>
                            </div>
                        </li>
                    )
                })}
               
            </ul>
        </div>
    )
}