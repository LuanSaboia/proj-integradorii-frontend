import { useState } from 'react'
import Head from "next/head";
import {
    Flex,
    Text,
    Heading,
    Button,
    Link as ChakraLink,
    useMediaQuery,
    Image,
    useDisclosure,
    Input
} from "@chakra-ui/react";

import { setupAPIClient } from "@/services/api";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Sidebar } from "@/components/sidebar";
import Link from "next/link";
import { parseCookies } from 'nookies';
import { ModalMatch } from '@/components/modalMatch';
import Router from 'next/router';

export interface MatchItem{
    id_part: string
    data_part: string,
    horario_part: string,
    local_part: string,
    placar_time1: string,
    placar_time2: string,
    nome_time1: string,
    imagem_time1: string,
    nome_time2: string,
    imagem_time2: string,
    fk_comp: string,
    fk_time1: string,
    fk_time2: string,
    winner: string,
    status: boolean
}

interface MatchProps{
    matches: MatchItem[],
}

export default function Match({ matches }: MatchProps){
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [list, setList] = useState(matches)
    const [selectedItem, setSelectedItem] = useState(null)
    console.log(matches)
    const handleOpenModal = (item) => {
        setSelectedItem(item);
        onOpen();
    }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async function createMatches(newMatches) {
        try {
            const apiClient = setupAPIClient();
    
            // Itera sobre o array de novas partidas
            for (const match of newMatches) {
                // Desestruturação para obter os dados necessários
                const { team1, team2 } = match;
    
                //Insere a partida no banco de dados
                await apiClient.post('/match', {
                    fk_comp: team1.fk_comp,
                    fk_time1: team1.id,
                    nome_time1: team1.nome_time,
                    imagem_time1: team1.imagem_time,
                    fk_time2: team2.id,
                    nome_time2: team2.nome_time,
                    imagem_time2: team2.imagem_time,
                    status: true,
                });
            }
    
            alert('Partidas criadas com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao criar as partidas');
        }
    }

    async function nextPhase() {
        // Crie um array para armazenar os vencedores
        const winners = [];
    
        // Verifique se todos os status estão marcados como false
        const allFalse = list.every((match) => {
            // Se o status é false, adicione o vencedor ao array
            if (!match.status) {
                //winners.push({imagem_time: match.imagem_time1, nome_time: match.nome_time1});
                const winnerInfo = {
                    id: match.winner,
                    fk_comp: match.fk_comp,
                    imagem_time: match.imagem_time1,
                    nome_time: match.nome_time1,
                };
    
                // Verifica se o vencedor é fk_time2
                if (match.winner === match.fk_time2) {
                    winnerInfo.imagem_time = match.imagem_time2;
                    winnerInfo.nome_time = match.nome_time2;
                }

                winners.push(winnerInfo);
            }
            return match.status === false;
        });
    
        if (allFalse) {
            alert('Partidas finalizadas! Avançando a fase');
    
            // Utilize a lista de vencedores para a próxima fase
            console.log(winners);

            // Embaralhe a lista de vencedores para sortear novos confrontos
            const shuffledWinners = shuffleArray(winners);

            // Crie novos pares de confrontos a partir dos times vencedores embaralhados
            const newMatches = [];
            for (let i = 0; i < shuffledWinners.length; i += 2) {
                const team1 = shuffledWinners[i];
                const team2 = shuffledWinners[i + 1];

                const match = {
                    team1,
                    team2,
                };

                // Adicione a nova partida ao array de novas partidas
                newMatches.push(match);
            }
            console.log(newMatches)
            await createMatches(newMatches);
            localStorage.removeItem('storedMatches');
            Router.push('/match/next');
        } else {
            alert('Ainda existem partidas ativas. Não redirecionando.');
        }
    }

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
                            onClick={() => handleOpenModal(item)}
                        >
                            <Flex
                                w="100%"
                                h="100%"
                                direction="row"
                                alignItems="center"
                                justify="center"
                            >
                            {item.winner ?
                                <Flex
                                    w="100%"
                                    direction={isMobile ? "column" : "row"}
                                    p={4}
                                    rounded={4}
                                    mb={2}
                                    bg={item.winner === item.fk_time1 ? "green.300" : "red.300"}
                                    justify="space-between"
                                    align={isMobile ? "flex-start" : "center"}
                                    mr={4}
                                >
                                    <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                                    <Text color="white" fontWeight="bold" ml={4} noOfLines={1}>{item.nome_time1}</Text>
                                </Flex>
                            </Flex>
                                :
                                <Flex
                                    w="100%"
                                    direction={isMobile ? "column" : "row"}
                                    p={4}
                                    rounded={4}
                                    mb={2}
                                    bg="system.400"
                                    justify="space-between"
                                    align={isMobile ? "flex-start" : "center"}
                                    mr={4}
                                >
                                <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                                    <Text color="white" fontWeight="bold" ml={4} noOfLines={1}>{item.nome_time1}</Text>
                                </Flex>
                            </Flex>
                            }
                                    <Input
                                        bg="system.900"
                                        mb={3}
                                        size="lg"
                                        type="text"
                                        w="5%"
                                        color="white"
                                        value={item.placar_time1}
                                    />
                                    <Text color="white" fontSize="3xl" ml={3} mr={3}>X</Text>
                                    <Input
                                        bg="system.900"
                                        mb={3}
                                        size="lg"
                                        type="text"
                                        w="5%"
                                        color="white"
                                        value={item.placar_time2}
                                    />
                            {item.winner ?
                            <Flex
                                w="100%"
                                direction={isMobile ? "column" : "row"}
                                p={4}
                                rounded={4}
                                mb={2}
                                ml={3}
                                bg={item.winner === item.fk_time1 ? "red.300" : "green.300"}
                                justify="space-between"
                                align={isMobile ? "flex-start" : "center"}
                            >
                                <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                                    <Text color="white" fontWeight="bold" ml={4} noOfLines={1}>{item.nome_time2}</Text>
                                </Flex>
                            </Flex>
                            :
                            <Flex
                                w="100%"
                                direction={isMobile ? "column" : "row"}
                                p={4}
                                rounded={4}
                                mb={2}
                                ml={3}
                                bg="system.400"
                                justify="space-between"
                                align={isMobile ? "flex-start" : "center"}
                            >
                                <Flex direction="row" mb={isMobile ? 2 : 0} align="center" justify="center">
                                    <Text color="white" fontWeight="bold" ml={4} noOfLines={1}>{item.nome_time2}</Text>
                                </Flex>
                            </Flex>
                            }

                            </Flex>
                        </ChakraLink>
                    ))}

                    <Button mt={5} onClick={ nextPhase }>Próxima fase</Button>
                    <ModalMatch
                        isOpen={isOpen}
                        onOpen={onOpen}
                        onClose={onClose}
                        data={selectedItem}
                    />

                </Flex>

            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {

        const apiClient = setupAPIClient(ctx);
        const cookies = parseCookies(ctx);

        const fk_comp = cookies['fk_competicao'];
        const response = await apiClient.get('/match/championship', {
            params:{
                fk_comp: fk_comp,
            }
        })

        return {
            props:{
                matches: response.data
            }
        }

    } catch (error) {
        console.log(error);
        return {
            props:{
                matches: []
            }
        }

    }

})