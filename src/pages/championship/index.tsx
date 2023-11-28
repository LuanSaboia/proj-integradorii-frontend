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


interface ChampionshipItem{
    id_comp: string,
    nome_comp: string,
    descricao_comp: string,
    premiacao_comp: string,
    data_ini_comp: string,
    data_termi_comp: string,
    situacao_comp: boolean,
    timeVencedor: string,
    quantidade_times_comp: string,
}

interface ChampionshipsProps{
    championships: ChampionshipItem[]
}

export default function Championship({ championships }: ChampionshipsProps){

    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [championshipList, setChampionshipList] = useState<ChampionshipItem[]>(championships || [])
    const [disableChampionship, setDisableChampionship] = useState("enabled")

    async function handleDisabled(e: ChangeEvent<HTMLInputElement>) {
        const apiClient = setupAPIClient();

        if(e.target.value === "disabled"){
            setDisableChampionship("enabled")

            const response = await apiClient.get('/championships', {
                params:{
                    situacao_comp: true
                }
            })
            console.log(response.data)
            setChampionshipList(response.data)
        } else {
            setDisableChampionship("disabled")

            const response = await apiClient.get('/championships', {
                params:{
                    situacao_comp: false
                }
            })
            console.log(response.data)
            setChampionshipList(response.data)
        }
    }

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

                        <Link href="/championship/new">
                            <Button>Cadastrar novo</Button>
                        </Link>

                        <Stack ml="auto" align="center" direction="row">
                            <Text color="white" fontWeight="bold">Ativos</Text>
                            <Switch
                                colorScheme="green"
                                size="lg"
                                value={disableChampionship}
                                onChange={ (e: ChangeEvent<HTMLInputElement>) => handleDisabled(e) }
                                isChecked={disableChampionship === "disabled" ? false : true}
                            />
                        </Stack>
                    </Flex>

                    {championshipList.map(championship => (
                        <Flex align="center">
                            <Link key={championship.id_comp} href={`/championship/${championship.id_comp}`}>
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
                                            {championship.nome_comp}
                                        </Text>
                                    </Flex>

                                    <Flex>
                                        <Text color="white" fontWeight="bold" mr={3}>
                                            Times competindo: {championship.quantidade_times_comp}
                                        </Text>
                                        <Text color="white" fontWeight="bold" mr={1}>
                                        | Status:
                                        </Text>
                                        <Text color={championship.situacao_comp ? "green.300" : "red.300"} fontWeight="bold">
                                            {championship.situacao_comp ? "Ativo" : "Finalizado" }
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Link>
                            {championship.timeVencedor ?
                                <Link key={championship.id_comp} href={`/match`}>
                                    <Button ml={3}>Ver partidas</Button>
                                </Link>
                                :
                                <Link key={championship.id_comp} href={`/championship/match/${championship.id_comp}`}>
                                    <Button ml={3}>Partidas</Button>
                                </Link>
                            }
                        </Flex>
                    ))}

                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/championships')

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
                championships: response.data
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