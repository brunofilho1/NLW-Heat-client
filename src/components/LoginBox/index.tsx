import styles from './styles.module.scss';
import {VscGithubInverted} from 'react-icons/vsc'
import { useContext, useEffect } from 'react';
import { api } from '../../services/api';
import { AuthContext } from '../../contexts/auth';


export function LoginBox() {

    const {signInUrl} = useContext(AuthContext)
    // contexto = compartilhamento de informações entre vários componentes
    // esse contexto vai provendo as informações necessárias pra cada Component do app, 
    // o que cada component precisa do fluxo de autenticação e todos terão acesso a essas informações

    return (
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua mensagem</strong>
            <a href={signInUrl} className={styles.signInWithGithub}>
                <VscGithubInverted size="24px"/>
                Entrar com GitHub
            </a>
        </div>
    )
}