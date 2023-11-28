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
import Router from "next/router";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";

export default function NewTeam(){
    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [nome, setNome] = useState('')
    const [abreviar, setAbreviar] = useState('')
    const [image, setImage] = useState('')

    async function handleRegister(){
        
        try {
            const apiClient = setupAPIClient();
            await apiClient.post('/team', {
                nome_time: nome,
                abreviacao_time: abreviar,
                imagem_time: image || null
            })

            Router.push("/team")
        } catch (error) {
            console.log(error)
            alert('Erro ao cadastrar')
        }
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

                            <Flex
                                maxW="700px"
                                align="center"
                                mb={3}
                                w="85%"
                            >
                                {image ? 
                                    <Image
                                        //borderRadius='full'
                                        boxSize='34px'
                                        src={image}
                                        alt='RMA'
                                        visibility={image ? "visible" : "hidden"}
                                        mr={2}
                                    /> : <></>
                                }
                                
                                <Input 
                                    placeholder="Url do escudo"
                                    w="100%"
                                    size="lg"
                                    type="text"
                                    bg="system.900"
                                    color="white"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                />
                            </Flex>

                            <Input 
                                placeholder="Nome do time"
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
                                placeholder="Abreviação do time"
                                w="85%"
                                size="lg"
                                mb={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={abreviar}
                                onChange={(e) => setAbreviar(e.target.value)}
                            />
                            {/* <Select mb={3} size="lg" w="85%" bg="system.900" color="white">
                                <option key={1} value="Toni Kroos">Toni Kroos</option>
                            </Select> */}

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
        
    } catch (error) {
        console.log(error)

        return {
            redirect:{
                destination: '/dashboard',
                permanent: false
            }
        }
    }
    return {
        props:{
            
        }
    }
})