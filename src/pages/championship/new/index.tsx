import { useState } from "react";
import Head from "next/head";
import { Sidebar } from "@/components/sidebar";

import {
    Flex,
    Text,
    Heading,
    Button,
    useMediaQuery,
    Input
} from "@chakra-ui/react"

import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi"
import Router from "next/router";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";

export default function NewChampionship(){
    const [isMobile] = useMediaQuery("(max-width: 500px)")
    const [nomeComp, setNomeComp] = useState('');
    const [descricaoComp, setDescricaoComp] = useState('');
    const [premiacaoComp, setPremiacaoComp] = useState('');
    const [dtInicioComp, setDtInicioComp] = useState('');
    const [dtFimComp, setDtFimComp] = useState('');
    //const [situacaoComp, setSituacaoComp] = useState('');
    const [qtdTimeComp, setQtdTimeComp] = useState('');

    async function handleRegister(){
        if(nomeComp === '' || premiacaoComp === '' || dtInicioComp === '' || dtFimComp === '' || qtdTimeComp === ''){
            return
        }

        try {
            const apiClient = setupAPIClient();
            await apiClient.post('/championship', {
                nome_comp: nomeComp,
                descricao_comp: descricaoComp,
                premiacao_comp: premiacaoComp,
                data_ini_comp: dtInicioComp,
                data_termi_comp: dtFimComp,
                situacao_comp: true,
                quantidade_times_comp: Number(qtdTimeComp),
            })

            Router.push("/championship")
        } catch (error) {
            console.log(error)
            alert('Erro ao cadastrar')
        }
    }

    return(
        <>
            <Head>
                <title>Novo campeonato</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">
                    
                    <Flex
                        direction={isMobile? "column" : "row"}
                        w="100%"
                        align={isMobile? "flex-start" : "center"}
                        mb={isMobile? 4 : 0}
                    >
                        <Link href="/championship">
                            <Button p={4} display="flex" alignItems="center" justifyItems="center" mr={4}>
                                <FiChevronLeft size={24} />
                                Voltar
                            </Button>
                        </Link>
                        <Heading
                            color="orange.900"
                            fontSize={isMobile? "28px" : "3xl"}
                            mt={4}
                            mb={4}
                            mr={4}
                        >
                            Campeonato
                        </Heading>

                    </Flex>
                    
                        <Flex
                            direction={"column"}
                            maxW="700px"
                            bg="system.400"
                            w="100%"
                            align="center"
                            justify="center"
                            pt={8}
                            pb={8}
                        >
                            <Heading mb={4} fontSize={isMobile? "22px" : "3xl"} color="white">Cadastrar campeonato</Heading>

                            <Input 
                                placeholder="Nome do campeonato"
                                size="lg"
                                type="text"
                                w="85%"
                                color="white"
                                mb={3}
                                value={nomeComp}
                                onChange={(e) => setNomeComp(e.target.value)}
                            />
                            <Input 
                                placeholder="Descrição do campeonato"
                                size="lg"
                                type="text"
                                w="85%"
                                color="white"
                                mb={3}
                                value={descricaoComp}
                                onChange={(e) => setDescricaoComp(e.target.value)}
                            />
                            <Input 
                                placeholder="Premiação do campeonato"
                                size="lg"
                                type="number"
                                w="85%"
                                color="white"
                                mb={3}
                                value={premiacaoComp}
                                onChange={(e) => setPremiacaoComp(e.target.value)}
                            />
                            <Input 
                                placeholder="Data de início"
                                size="lg"
                                type="date"
                                w="85%"
                                color="white"
                                mb={3}
                                value={dtInicioComp}
                                onChange={(e) => setDtInicioComp(e.target.value)}
                            />
                            <Input 
                                placeholder="Data de término"
                                size="lg"
                                type="date"
                                w="85%"
                                color="white"
                                mb={3}
                                value={dtFimComp}
                                onChange={(e) => setDtFimComp(e.target.value)}
                            />
                            <Input 
                                placeholder="Quantidade de times"
                                size="lg"
                                type="number"
                                w="85%"
                                color="white"
                                mb={3}
                                value={qtdTimeComp}
                                onChange={(e) => setQtdTimeComp(e.target.value)}
                            />

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