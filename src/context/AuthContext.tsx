import { createContext, ReactNode, useState, useEffect } from "react";
import { destroyCookie, setCookie, parseCookies } from "nookies"
import Router from "next/router";

import { api } from "@/services/apiClient";

interface AuthContextData {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signUp: (credentials: SignUpProps) => Promise<void>;
    logoutUser: () => Promise<void>;
}

interface UserProps {
    id: string;
    name: string;
    sobrenome: string;
    email_user: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

interface SignInProps {
    email_user: string;
    senha_user: string;
}

interface SignUpProps {
    nome_user: string,
    sobrenome_user: string,
    email_user: string,
    senha_user: string,
}

export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try {
        destroyCookie(null, '@system.token', { path: '/' })
        Router.push('/login');
        
    } catch (error) {
        console.log("Error ao sair")
    }
}

export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    useEffect(() => {
        const { '@system.token': token} = parseCookies();
        if(token){
            console.log(token)
            // api.get('/me').then(res => {
            //     const { id, name, sobrenome, email_user } = res.data;
            //     setUser({
            //         id,
            //         name,
            //         sobrenome,
            //         email_user
            //     })
            // }).catch(() => {
            //     signOut()
            // })
        }
    })

    async function signIn({ email_user, senha_user }: SignInProps){
        try {
            const response = await api.post("/session", {
                email_user,
                senha_user
            })
            
            const { id, name, sobrenome, token } = response.data;

            setCookie(undefined, '@system.token', token, {
                maxAge: 60 * 60 * 24 * 30, //1 mês
                path: '/'
            })

            setUser({
                id,
                name,
                sobrenome,
                email_user
            })

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            Router.push('/dashboard');

        } catch (error) {
            console.log("Erro ao entrar", error)
        }
    }

    async function signUp({ nome_user, sobrenome_user, email_user, senha_user }: SignUpProps){
        try {
            const response = await api.post('/users', {
                nome_user,
                sobrenome_user,
                email_user,
                senha_user,
            })

            Router.push('/login')
        } catch (error) {
            console.log(error)
        }
    }

    async function logoutUser() {
        try {
            destroyCookie(null, '@system.token', { path: '/' })
            Router.push('/login')
            setUser(null)
        } catch (error) {
            console.log("Erro ao sair", error)
        }
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, logoutUser }}>
            {children}
        </AuthContext.Provider>
    )
}