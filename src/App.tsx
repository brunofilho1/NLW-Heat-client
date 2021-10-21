import { useContext } from 'react';
import styles from './App.module.scss';
import { LoginBox } from './components/LoginBox';
import { MessageList } from './components/MessageList';
import { SendMessageForm } from './components/SendMessageForm'
import { AuthContext } from './contexts/auth';

export function App() {

  const {user} = useContext(AuthContext);


  return (                                    // se o usuário tiver preenchido...
    <main className={`${styles.contentWrapper} ${!!user ? styles.contentSigned : ''}`}> 
      <MessageList/> 
      {!!user ? <SendMessageForm /> : <LoginBox/>}
    </main>
    //se ele não estiver nulo mostre isso, senão mostre isso // ifelse // condicionais
  )

}
