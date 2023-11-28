import { useState, useContext } from "react"
import Head from "next/head"
import { Flex, Text, Center, Input, Button} from "@chakra-ui/react"

import Link from "next/link"

import { AuthContext } from "@/context/AuthContext"

import { canSSRGuest } from "@/utils/canSSRGuest"

export default function Login(){
    const { signIn } = useContext(AuthContext)

    const [email_user, setEmail] = useState('')
    const [senha_user, setPassword] = useState('')

    async function handleLogin(){

        if(email_user === '' || senha_user === ''){
            return;
        }

        await signIn({
            email_user,
            senha_user
        })
    }

    return(
        <>
            <Head>
                <title>Faça login para acessar</title>
            </Head>
            <Flex background="system.900" height="100vh" alignItems="center" justifyContent="center">
                
                <Flex width={640} direction="column" p={14} rounded={8}>
                    <Center>

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
                        mb={6}
                        color="#FFF"
                        value={senha_user}
                        onChange={ (e) => setPassword(e.target.value) }
                    />
                    <Button
                        background="button.cta"
                        mb={6}
                        color="gray.900"
                        size="lg"
                        _hover={{ bg: "#ffb13e"}}
                        onClick={handleLogin}
                    >
                        Acessar
                    </Button>

                    <Center mt={2}>
                        <Link href="/register">
                            <Text cursor="pointer" color="#FFF">Ainda não possui conta? <strong>Cadastre-se</strong></Text>
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