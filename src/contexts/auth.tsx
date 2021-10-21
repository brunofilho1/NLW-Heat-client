import {createContext, ReactNode, useEffect, useState} from 'react'
import { api } from '../services/api'

type User = {
    id: string,
    name: string,
    login: string,
    avatar_url: string
}

type AuthContextData = {
    user: User | null,
    signInUrl: string,
    signOut: () => void
}

export const AuthContext = createContext({} as AuthContextData)

// contexto = compartilhamento de informações entre vários componentes
// esse contexto vai provendo as informações necessárias pra cada Component do app, 
// o que cada component precisa do fluxo de autenticação e todos terão acesso a essas informações

type AuthProvider = {
    children: ReactNode // qualquer coisa aceitada pelo React
}

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

export function AuthProvider(props: AuthProvider) {

    const [user, setUser] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=dceffa34cb532c88b226`;

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode,
        })

        const {token, user} = response.data;

        localStorage.setItem('@dowhile:token', token)

        api.defaults.headers.common.authorization = `Bearer ${token}`
            // o axios permite que eu 'sete' esse defaults.headers pra que toda requisição que parta de
            // commom pra frente que ela vá automaticamente com o token de autenticação junto ao cabeçalho da requisição

        setUser(user)
        
        // essa rota vai me devolver os dados do usuário autenticado e um token(JWT) pra manter o usuário autenticado no app por um 1 dia (nesse caso)
    }

    function signOut() {
        setUser(null)
        localStorage.removeItem('@dowhile:token')
    }

    useEffect(() => {
        const token = localStorage.getItem('@dowhile:token')

        if(token) {

            api.defaults.headers.common.authorization = `Bearer ${token}`
            // o axios permite que eu 'sete' esse defaults.headers pra que toda requisição que parta de
            // commom pra frente que ela vá automaticamente com o token de autenticação junto ao cabeçalho da requisição
            api.get<User>('profile').then(response => {
                setUser(response.data)
                
            })
        }
    }, [])

    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code='); // determina se um array contém um determinado elemento, retornando true ou false

        if(hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code='); // O método split() divide uma String em uma lista ordenada de substrings
            console.log({urlWithoutCode, githubCode});

            window.history.pushState({}, '', urlWithoutCode) // força a navegação do usuário / mudar a url do browser sem dar refresh
            
            signIn(githubCode);
        }

    }, [])

    return (
        <AuthContext.Provider value={{signInUrl, user, signOut}}>
            {props.children}
        </AuthContext.Provider>
    )

    // vai retornar algo que vem de dentro do AuthContext

    // esse Provider vai fazer com que todos os componentes que estejam dentro dele tenha acesso à informação do contexto
}
