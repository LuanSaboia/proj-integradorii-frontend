import { useState } from 'react'
import Head from "next/head";
import {
    Flex,
    Text,
    Heading,
    Button,
    Link as ChakraLink,
    useMediaQuery,
    Image
} from "@chakra-ui/react";

import { setupAPIClient } from "@/services/api";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";

export interface TeamItem{
    id_time: string,
    nome_time: string,
    abreviacao_time: string,
    imagem_time: string
}

interface Footballer{
    id_jogador: string,
    nome_jogador: string,
    time: TeamItem
}

interface TeamProps{
    times: TeamItem[],
    jogadores: Footballer[]
}

export default function Team({ times, jogadores }: TeamProps){
    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [list, setList] = useState(times)
    const [jogador, setJogador] = useState(jogadores)
    //const 

    return(
        <>
            <Head>
                <title>Times</title>
            </Head>
            <Sidebar>
                <Flex direction="column" align="flex-start" justify="flex-start">
                    
                    <Flex w="100%" direction="row" align="center">
                        <Heading
                            fontSize="3xl"
                            mt={4}
                            mb={4}
                            mr={4}
                            color="white"
                        >Times</Heading>

                        <Link href="/team/new">
                            <Button>Cadastrar</Button>
                        </Link>
                    </Flex>

                    {list.map(item =>(
                        <ChakraLink
                            w="100%"
                            m={0}
                            p={0}
                            mt={1}
                            bg="transparent"
                            style={{ textDecoration: "none" }}
                        >
                            <Flex
                                w="100%"
                                direction={isMobile ? "column" : "row"}
                                p={4}
                                rounded={4}
                                mb={2}
                                bg="system.400"
                                justify="space-between"
                                align={isMobile ? "flex-start" : "center"}
                            >
                                <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                                    {item.imagem_time ? 
                                        <Image
                                            boxSize='34px'
                                            src={item.imagem_time}
                                            alt='RMA'
                                            visibility={item.imagem_time ? "visible" : "hidden"}
                                            mr={2}
                                        /> : <></>
                                    }
                                    <Text color="white" fontWeight="bold" ml={4} noOfLines={1}>{item.nome_time}</Text>
                                </Flex>
                                <Text color="white" fontWeight="bold" mb={isMobile ? 2 : 0}>{item.abreviacao_time}</Text>
                            </Flex>
                        </ChakraLink>
                    ))}

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/teams')
        const res = await apiClient.get('/footballer')

        return {
            props:{
                times: response.data,
                jogadores: res.data
            }
        }

    } catch (error) {
        console.log(error);
        return {
            props:{
                times: [],
                jogadores: []
            }
        }

    }

})