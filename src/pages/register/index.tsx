import { useState, useContext } from "react"
import Head from "next/head"
import { Flex, Text, Center, Input, Button} from "@chakra-ui/react"

import Link from "next/link"

import { AuthContext } from "@/context/AuthContext"

import { canSSRGuest } from "@/utils/canSSRGuest"

export default function Register(){
    const { signUp } = useContext(AuthContext)

    const [nome_user, setName] = useState('')
    const [sobrenome_user, setLastName] = useState('')
    const [email_user, setEmail] = useState('')
    const [senha_user, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    async function handleRegister(){
        if(nome_user === '' && email_user === '' && senha_user === ''){
            return;
        }
        if(senha_user !== confirmPassword){
            console.log("Senha diferente");
            return;
        }

        await signUp({
            nome_user,
            sobrenome_user,
            email_user,
            senha_user,
        })
    }

    return(
        <>
            <Head>
                <title>Crie sua conta</title>
            </Head>
            <Flex background="system.900" height="100vh" alignItems="center" justifyContent="center">
                
                <Flex width={640} direction="column" p={14} rounded={8}>
                    <Center>                  
                        <Input
                            background="system.400"
                            variant="filled"
                            size="lg"
                            placeholder="Nome"
                            type="text"
                            mb={3}
                            mr={3}
                            color="#FFF"
                            value={nome_user}
                            onChange={ (e) => setName(e.target.value) }
                        />
                        <Input
                            background="system.400"
                            variant="filled"
                            size="lg"
                            placeholder="Sobrenome"
                            type="text"
                            mb={3}
                            color="#FFF"
                            value={sobrenome_user}
                            onChange={ (e) => setLastName(e.target.value) }
                        />
                    </Center>
                    <Input
                        background="system.400"
                        variant="filled"
                        size="lg"
                        placeholder="email@email.com"
                        type="email"
                        mb={3}
                        color="#FFF"
                        value={email_user}
                        onChange={ (e) => setEmail(e.target.value) }
                    />
                    <Input
                        background="system.400"
                        variant="filled"
                        size="lg"
                        placeholder="********"
                        type="password"
                        mb={3}
                        color="#FFF"
                        value={senha_user}
                        onChange={ (e) => setPassword(e.target.value) }
                    />
                    <Input
                        background="system.400"
                        variant="filled"
                        size="lg"
                        placeholder="********"
                        type="password"
                        mb={6}
                        color="#FFF"
                        value={confirmPassword}
                        onChange={ (e) => setConfirmPassword(e.target.value) }
                    />
                    <Button
                        background="button.cta"
                        mb={6}
                        color="gray.900"
                        size="lg"
                        _hover={{ bg: "#ffb13e"}}
                        onClick={handleRegister}
                    >
                        Acessar
                    </Button>

                    <Center mt={2}>
                        <Link href="/login">
                            <Text cursor="pointer" color="#FFF">Já possui conta? <strong>Faça login</strong></Text>
                        </Link>
                    </Center>
                </Flex>

            </Flex>
        </>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return{
        props: {}
    }
});