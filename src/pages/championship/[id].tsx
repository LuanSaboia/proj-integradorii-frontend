import { useState } from "react";
import Head from "next/head";
import {
    Flex,
    Text,
    Heading,
    Button,
    useMediaQuery,
    Input,
    Stack,
    Switch,
    useDisclosure
} from "@chakra-ui/react"
import { Sidebar } from "@/components/sidebar";

import Link from "next/link";
import { FiChevronLeft } from "react-icons/fi"

import Router from "next/router";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { ModalInfo } from "@/components/modal";

export interface TeamItem{
    id_time: string,
    nome_time: string,
    abreviacao_time: string,
    imagem_time: string,
    fk_competicao: string
}

interface ChampionshipProps{
    id_comp: string,
    nome_comp: string,
    descricao_comp: string,
    premiacao_comp: string,
    data_ini_comp: string,
    data_termi_comp: string,
    situacao_comp: string,
    quantidade_times_comp: string,
}

interface EditChampionshipProps{
    championship: ChampionshipProps,
    team: TeamItem
}

export default function EditChampionship({ championship, team }: EditChampionshipProps){
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [isMobile] = useMediaQuery("(max-width: 500px)");
    const [idComp, setIdComp] = useState(championship?.id_comp)

    const [nomeComp, setNomeComp] = useState(championship?.nome_comp);
    const [descricaoComp, setDescricaoComp] = useState(championship?.descricao_comp);
    const [premiacaoComp, setPremiacaoComp] = useState(championship?.premiacao_comp);
    const [dtInicioComp, setDtInicioComp] = useState(championship?.data_ini_comp);
    const [dtFimComp, setDtFimComp] = useState(championship?.data_termi_comp);
    //const [situacaoComp, setSituacaoComp] = useState(championship?.);
    const [qtdTimeComp, setQtdTimeComp] = useState(championship?.quantidade_times_comp);
    const [status, setStatus] = useState(championship?.situacao_comp)

    const [service, setService] = useState<TeamItem>()

    const [disableChampionship, setDisableChampionship] = useState(championship?.situacao_comp === "Ativo" ? "disabled" : "enabled")

    async function handleUpdate() {
        if(nomeComp === '' || premiacaoComp === '' || dtInicioComp === '' || dtFimComp === '' || qtdTimeComp === ''){
            return
        }

        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/championship', {
                nome_comp: nomeComp,
                descricao_comp: descricaoComp,
                premiacao_comp: premiacaoComp,
                data_ini_comp: dtInicioComp,
                data_termi_comp: dtFimComp,
                quantidade_times_comp: Number(qtdTimeComp),
                id_comp: championship?.id_comp
            })
            alert('Atualizado com sucesso')

            Router.push("/championship")
        } catch (error) {
            console.log(error)
            alert('Erro ao atualizar')
        }
    }

    function handleOpenModal( team: TeamItem ) {
        setService(team)
        onOpen();
    }

    async function handleFinish(id: string) {
        console.log(id)
    }

    return(
        <>
            <Head>
                <title>Editando campeonato</title>
            </Head>
            <Sidebar>
                <Flex direction="column" alignItems="flex-start" justifyContent="flex-start">

                    <Flex
                        direction={isMobile ? "column" : "row"}
                        w="100%"
                        alignItems={isMobile ? "flex-start" : "center"}
                        justifyContent="flex-start"
                        mb={isMobile ? 4 : 0}
                    >

                        <Link href="/championship">
                            <Button p={4} display="flex" alignItems="center" justifyContent="center" mr={4}>
                                <FiChevronLeft size={24} />
                                Voltar
                            </Button>
                        </Link>

                        <Heading
                            color="orange.900"
                            fontSize={isMobile? "28px" : "3xl"}
                        >
                            Editar Campeonato
                        </Heading>
                    </Flex>

                    <Flex mt={4} maxW="700px" pt={8} pb={8} w="100%" bg="system.400" direction="column" align="center" justify="center">
                        <Heading fontSize={isMobile ? "22px" : "3xl"} color="white" mb={4}>Editar campeonato</Heading>

                        <Flex
                            w="85%"
                            direction="column"
                        >
                            <Input
                                placeholder="Nome"
                                bg="system.900"
                                mb={3}
                                size="lg"
                                type="text"
                                w="100%"
                                color="white"
                                value={nomeComp}
                                onChange={ (e) => setNomeComp(e.target.value) }
                            />
                            <Input
                                placeholder="Descrição"
                                bg="system.900"
                                mb={3}
                                size="lg"
                                type="text"
                                w="100%"
                                color="white"
                                value={descricaoComp}
                                onChange={ (e) => setDescricaoComp(e.target.value) }
                            />
                            <Input
                                placeholder="Premiação"
                                bg="system.900"
                                mb={3}
                                size="lg"
                                type="text"
                                w="100%"
                                color="white"
                                value={premiacaoComp}
                                onChange={ (e) => setPremiacaoComp(e.target.value) }
                            />
                            <Input
                                placeholder="Data de início"
                                bg="system.900"
                                mb={3}
                                size="lg"
                                type="date"
                                w="100%"
                                color="white"
                                value={dtInicioComp}
                                onChange={ (e) => setDtInicioComp(e.target.value) }
                            />
                            <Input
                                placeholder="Data de término"
                                bg="system.900"
                                mb={3}
                                size="lg"
                                type="date"
                                w="100%"
                                color="white"
                                value={dtFimComp}
                                onChange={ (e) => setDtFimComp(e.target.value) }
                            />
                            <Input
                                placeholder="Times competindo"
                                bg="system.900"
                                mb={3}
                                size="lg"
                                type="number"
                                w="100%"
                                color="white"
                                value={qtdTimeComp}
                                onChange={ (e) => setQtdTimeComp(e.target.value) }
                            />

                            <Text fontWeight="bold" color="white">Cadastrar time no campeonato?</Text>
                            <Button
                                mb={3}
                                w="100%"
                                onClick={() => handleOpenModal(team)}
                            >
                                Adicionar
                            </Button>
                            {/* <Stack mb={6} align="center" direction="row">
                                <Switch
                                    size="lg"
                                    colorScheme="red"
                                    value={disableChampionship}
                                    isChecked={disableChampionship === "disabled" ? false : true}
                                />
                            </Stack> */}

                            <Button
                                mb={6}
                                w="100%"
                                bg="button.cta"
                                color="gray.900"
                                _hover={{ bg: "#FFb13e"}}
                                onClick={handleUpdate}
                            >
                                Salvar
                            </Button>
                        </Flex>
                    </Flex>

                </Flex>
            </Sidebar>

            <ModalInfo
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                data={service}
                finishService={ () => handleFinish(service?.id_time) }
                championship={idComp}
            />
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const { id } = ctx.params;
    console.log(id)

    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/championship/detail', {
            params:{
                id_comp: id,
            }
        })
        const timeResponse = await apiClient.get('/teams');
        return {
            props:{
                championship: response.data,
                team: timeResponse.data
            }
        }


    } catch (error) {
        console.log(error)

        return {
            redirect:{
                destination: '/championships',
                permanent: false
            }
        }
    }
    
})