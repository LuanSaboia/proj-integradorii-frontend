import { useState } from "react";
import Head from "next/head";
import { Sidebar } from "@/components/sidebar";

import {
    Flex,
    Text,
    Heading,
    Button,
    useMediaQuery,
    Input,
    Select,
    Image
} from "@chakra-ui/react"

import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi"
import { useRouter } from "next/router";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";

interface TeamItem {
    id_time: string,
    nome_time: string,
    abreviacao_time: string
}

interface NewProps{
    times: TeamItem[]
}

export default function NewFootballer({ times }: NewProps){
    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [nome, setNome] = useState('')
    const [numero, setNumero] = useState('')
    const [timeSelect, setTimeSelect] = useState(times[0])
    const router = useRouter();

    async function handleRegister(){
        
        try {
            const apiClient = setupAPIClient();
            await apiClient.post('/footballer', {
                nome_jogador: nome,
                numero_jogador: Number(numero),
                fk_time: timeSelect?.id_time || null
            })

            router.push("/team")
        } catch (error) {
            console.log(error)
            alert('Erro ao cadastrar')
        }
    }

    async function handleChangeSelect(id: string) {
        const timeItem = times.find(item => item.id_time === id)
        setTimeSelect(timeItem)
    }

    return(
        <>
            <Head>
                <title>Novo time</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    
                    <Flex
                        direction={isMobile? "column" : "row"}
                        w="100%"
                        align={isMobile? "flex-start" : "center"}
                        justify="flex-start"
                        mb={isMobile? 4 : 0}
                    >
                        <Link href="/team">
                            <Button p={4} display="flex" alignItems="center" justifyItems="center" mr={4}>
                                <FiChevronLeft size={24} />
                                Voltar
                            </Button>
                        </Link>
                        <Heading
                            color="white"
                            fontSize={isMobile? "28px" : "3xl"}
                            mt={4}
                            mb={4}
                            mr={4}
                        >
                            Novo time
                        </Heading>

                    </Flex>
                    
                        <Flex
                            maxW="700px"
                            pt={8}
                            pb={8}
                            w="100%"
                            direction={"column"}
                            align="center"
                            justify="center"
                            bg="system.400"
                        >
                            <Heading mb={4} fontSize={isMobile? "22px" : "3xl"} color="white">Cadastrar campeonato</Heading>

                            <Input 
                                placeholder="Nome do jogador"
                                w="85%"
                                size="lg"
                                mb={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                            />
                            <Input 
                                placeholder="Numero da camisa"
                                w="85%"
                                size="lg"
                                mb={3}
                                type="number"
                                bg="system.900"
                                color="white"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                            />
                            <Select mb={3} size="lg" w="85%" bg="system.900" color="white" onChange={ (e) => handleChangeSelect(e.target.value)}>
                                {times?.map( item => (
                                    <option key={item?.id_time} value={item?.id_time}>{item?.nome_time}</option>
                                ))}
                            </Select>

                            <Button
                            onClick={handleRegister}
                                w="85%"
                                size="lg"
                                color="gray.900"
                                mb={6}
                                bg="button.cta"
                                _hover={{ bg: "#FFb13e"}}
                            >
                                Cadastrar
                            </Button>
                        </Flex>

                </Flex>
            </Sidebar>

        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/teams');

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
                times: response.data
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