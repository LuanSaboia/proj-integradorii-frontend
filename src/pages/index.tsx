import Head from "next/head"
import { Flex, Text } from "@chakra-ui/react"

export default function Home(){
    return(
        <>
            <Head>
                <title>Sistema de Competição</title>
            </Head>
            <Flex background="system.900">
                <Text>Teste Projeto</Text>
            </Flex>
        </>
    )
}