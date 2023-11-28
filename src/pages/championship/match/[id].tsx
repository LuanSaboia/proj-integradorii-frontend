import { useState, ChangeEvent } from "react"
import Head from "next/head";
import { Sidebar } from "@/components/sidebar";
import { 
    Flex,
    Text,
    Heading,
    Button,
    Stack,
    Switch,
    useMediaQuery,
    Image
} from "@chakra-ui/react"
import Link from "next/link";

import { IoMdPricetag } from "react-icons/io"
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import Router from "next/router";

import { setCookie } from "nookies";

export interface TeamItem{
    id_time: string,
    nome_time: string,
    abreviacao_time: string,
    imagem_time: string,
    fk_competicao: string
}

interface TeamProps{
    teams: TeamItem[]
}

export default function Match({ teams }: TeamProps){

    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [teamList, setteamList] = useState<TeamItem[]>(teams || [])
    const [idComp, setIdComp] = useState('')

    async function handleMatch() {
        // Copie a lista de times para não modificar o estado diretamente
        const shuffledTeams = [...teamList];
        const apiClient = setupAPIClient();
        // Mescle aleatoriamente a lista de times
        for (let i = shuffledTeams.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTeams[i], shuffledTeams[j]] = [shuffledTeams[j], shuffledTeams[i]];
        }

        // Agrupe os times em pares para formar as partidas
        const matches = [];
        for (let i = 0; i < shuffledTeams.length; i += 2) {
            const team1 = shuffledTeams[i];
            const team2 = shuffledTeams[i + 1];

            if (team1 && team2) {
            const match = {
                team1,
                team2,
            };
            try {
                const apiClient = setupAPIClient();
                await apiClient.post('/match', {
                  fk_comp: team1.fk_competicao,
                  fk_time1: team1.id_time,
                  nome_time1: team1.nome_time,
                  img_time1: team1.imagem_time,
                  fk_time2: team2.id_time,
                  nome_time2: team2.nome_time,
                  img_time2: team2.imagem_time,
                  status: true
                });
                setCookie(null, 'fk_competicao', team1.fk_competicao, {
                    maxAge: 30 * 24 * 60 * 60, // Tempo de vida do cookie em segundos
                    path: '/',
                });
            } catch (error) {
                console.log(error);
                alert('Erro ao cadastrar a partida');
            }

            matches.push(match);
            }
        }
            alert('Sorteio Feito! Redirecionando para partidas...' + idComp)
            console.log(matches);
            Router.push('/match')
        // Agora a variável "matches" contém os pares de times para as partidas
    }
    return(
        <>
            <Head>
                <title>Partidas</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    
                    <Flex
                        direction={isMobile? "column" : "row"}
                        w="100%"
                        alignItems={isMobile? "flex-start" : "center"}
                        justifyContent="flex-start"
                        mb={0}
                    >
                        <Heading
                            fontSize={isMobile? "28px" : "3xl"}
                            mt={4}
                            mb={4}
                            mr={4}
                            color="orange.900"
                        >
                            Partidas cadastrados
                        </Heading>

                        <Link href="/championship/new">
                            <Button>Cadastrar novo</Button>
                        </Link>
                    </Flex>

                    <Flex
                        direction="row"
                        w="auto"
                        alignItems={isMobile? "flex-start" : "center"}
                        justifyContent="center"
                        mb={0}
                        flexWrap="wrap"
                    >
                        {teams.map(time => (
                            <Link key={time.id_time} href={`/championship/${time.id_time}`}>
                                <Flex 
                                    cursor="pointer"
                                    w="auto"
                                    p={4}
                                    bg="system.400"
                                    direction={isMobile? "column" : "row"}
                                    align={isMobile? "flex-start" : "center"}
                                    rounded="4"
                                    mb={2}
                                    ml={2}
                                    justifyContent="space-between"
                                >
                                    <Flex mb={isMobile? 2 : 0} direction="row" alignItems="center" justifyContent="center">
                                    {time.imagem_time ? 
                                        <Image
                                            boxSize='34px'
                                            src={time.imagem_time}
                                            alt={time.abreviacao_time}
                                            visibility={time.imagem_time ? "visible" : "hidden"}
                                            mr={2}
                                        /> : <></>
                                    }
                                        <Text color="white" ml={4} noOfLines={2} fontWeight="bold">
                                            {time.nome_time}
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Link>
                        ))}
                        <Button
                            onClick={ handleMatch }
                            w="85%"
                            size="lg"
                            color="gray.900"
                            mb={6}
                            bg="button.cta"
                            _hover={{ bg: "#FFb13e"}}
                        >
                            Sortear jogos
                        </Button>
                    </Flex>

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const { id } = ctx.params;

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/team/championship', {
            params:{
                fk_competicao: id
            }
        })

        if(response.data === null){
            return {
                redirect:{
                    destination: '/championship',
                    permanent: false
                }
            }
        }
        
        return{
            props:{
                teams: response.data
            }
        }

    } catch (error) {
        console.log(error)
        return {
            redirect:{
                destination: '/dashboard',
                permanent: false
            }
        }
    }
})