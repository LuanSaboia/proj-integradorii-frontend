import { useState } from "react";
import { setupAPIClient } from "@/services/api";
import { canSSRAuth } from "@/utils/canSSRAuth";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Button,
    Flex,
    Select
} from "@chakra-ui/react"

import { FiUser } from "react-icons/fi"

export interface TeamItem{
    id_time: string,
    nome_time: string,
    abreviacao_time: string,
    imagem_time: string,
    fk_competicao: string,
}

interface NewProp{
    times: TeamItem[]
}

interface ModalInfoProps{
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
    data: TeamItem,
    finishService: () => Promise<void>,
    championship?: string
}

export function ModalInfo({ isOpen, onOpen, onClose, data, finishService, championship }: ModalInfoProps, {times}:NewProp){
    const [timeDetail, setTimeDetail] = useState<TeamItem>()
    
    async function handleChangeSelect(id: string) {
        const apiClient = setupAPIClient();
        const response = await apiClient.get('/team/detail', {
            params:{
                id_time: id,
            }
        })
        setTimeDetail(response.data)
        console.log(timeDetail)
    }

    async function handleUpdate(){
        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/team', {
                id_time: timeDetail.id_time,
                fk_competicao: championship
            })
            const apiClient1 = setupAPIClient();
            await apiClient1.post('/match', {
                fk_comp: championship,
                fk_time1: timeDetail.id_time,
                fk_time2: timeDetail.id_time
            })
            alert('Time inserido')

        } catch (error) {
            console.log(error)
            alert('Erro ao atualizar')
        }
    }
    
    return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent bg="system.400">
                <ModalHeader color="white">Adicionar time</ModalHeader>
                <ModalCloseButton/>

                <ModalBody>
                    <Flex align="center" mb={3}>
                        <FiUser size={28} color="white" ml={3}/>
                        <Text color="white">Teste Modal</Text>
                    </Flex>
                    <Select mb={3} size="lg" w="85%" bg="system.900" color="white" onChange={ (e) => handleChangeSelect(e.target.value) }>
                        {data?.map( item => (
                            <option key={item?.id_time} value={item?.id_time}>{item?.nome_time}</option>
                        ))}
                    </Select>
                </ModalBody>
                <ModalFooter>
                    <Button
                        bg="system.900"
                        _hover={{ bg: "#FFb13e" }}
                        color="#FFF"
                        mr={3}
                        onClick={ handleUpdate }
                    >
                        Cadastrar
                    </Button>
                </ModalFooter>

            </ModalContent>
        </Modal>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const apiClient = setupAPIClient(ctx);
        const response = await apiClient.get('/teams');

        return{
            props:{
                times: response.data
            }
        }

    } catch (error) {
        console.log(error)

        return {
            redirect:{
                destination: '/championship',
                permanent: false
            }
        }
    }
})