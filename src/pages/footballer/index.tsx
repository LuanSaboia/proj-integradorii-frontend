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
    useMediaQuery
} from "@chakra-ui/react"
import Link from "next/link";

import { IoMdPricetag } from "react-icons/io"
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";


interface TeamItem{
    id_time: string,
    nome_time: string,
    abreviacao_time: string
}

interface FootballersItem{
    id_jogador: string,
    nome_jogador: string,
    numero_jogador: number,
    time: TeamItem
}

interface FootballerssProps{
    footballers: FootballersItem[]
}

export default function Footballer({ footballers }: FootballerssProps){

    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [footballerList, setFootballerList] = useState<FootballersItem[]>(footballers || [])
    const [disableChampionship, setDisableChampionship] = useState("enabled")

    return(
        <>
            <Head>
                <title>Campeonatos</title>
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
                            Campeonatos cadastrados
                        </Heading>

                        <Link href="/footballer/new">
                            <Button>Cadastrar novo</Button>
                        </Link>
                    </Flex>

                    {footballerList.map(footballer => (
                        <Link key={footballer.id_jogador} href={`/footballer/${footballer.id_jogador}`}>
                            <Flex 
                                cursor="pointer"
                                w="900px"
                                p={4}
                                bg="system.400"
                                direction={isMobile? "column" : "row"}
                                align={isMobile? "flex-start" : "center"}
                                rounded="4"
                                mb={2}
                                justifyContent="space-between"
                                >
                                <Flex mb={isMobile? 2 : 0} direction="row" alignItems="center" justifyContent="center">
                                    <IoMdPricetag size={28} color="#fba931" />
                                    <Text color="white" ml={4} noOfLines={2} fontWeight="bold">
                                        {footballer.nome_jogador}
                                    </Text>
                                    <Text color="white" ml={4} noOfLines={2} fontWeight="bold">
                                        {footballer.numero_jogador}
                                    </Text>
                                </Flex>

                                <Flex>
                                    <Text color="white" fontWeight="bold" mr={3}>
                                        Time:  {footballer.time.nome_time}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Link>
                    ))}

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/footballer',
        {
            params:{
                status: true
            }
        })
        console.log(response.data)

        if(response.data === null){
            return {
                redirect:{
                    destination: '/dashboard',
                    permanent: false
                }
            }
        }
        
        return{
            props:{
                footballers: response.data
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