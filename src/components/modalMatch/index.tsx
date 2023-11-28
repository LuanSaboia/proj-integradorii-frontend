import { useState, ChangeEvent } from "react";
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
    Select,
    Input
} from "@chakra-ui/react"
import Router from "next/router";
import React from "react";

interface MatchItem{
    id_part: string,
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
    status: boolean,
    winner: string
}

interface MatchProps{
    matches: MatchItem[],
}

interface ModalInfoProps{
    isOpen: boolean,
    onOpen: () => void,
    onClose: () => void,
    data?: MatchItem,
}

export function ModalMatch({ isOpen, onOpen, onClose, data }: ModalInfoProps){
    const [dataPart, setDataPart] = useState('')
    const [horaPart, setHoraPart] = useState('')
    const [localPart, setLocalPart] = useState('')
    const [p1Part, setP1Part] = useState('')
    const [p2Part, setP2Part] = useState('')
    const [playersTeam1, setPlayersTeam1] = useState([]);
    const [playersTeam2, setPlayersTeam2] = useState([]);
    const [cardT1, setCardT1] = useState('')
    const [cardT2, setCardT2] = useState('')
    const [chuteT1, setChuteT1] = useState('')
    const [chuteT2, setChuteT2] = useState('') 
    const [escanteioT1, setEscanteioT1] = useState('')
    const [escanteioT2, setEscanteioT2] = useState('')
    const [posseT1, setPosseT1] = useState('')
    const [posseT2, setPosseT2] = useState('')

    const [selectedPlayersTeam1, setSelectedPlayersTeam1] = useState(Array.from({ length: parseInt(p1Part) }, () => ''));
    const [selectedPlayersTeam2, setSelectedPlayersTeam2] = useState(Array.from({ length: parseInt(p2Part) }, () => ''));
    const [momentGolTeam1, setMomentGolTeam1] = useState(Array.from({ length: parseInt(p1Part) }, () => ''));
    const [momentGolTeam2, setMomentGolTeam2] = useState(Array.from({ length: parseInt(p2Part) }, () => ''));

    const handleSelectChange = (index, team) => (event) => {
        const value = event.target.value;

        if (value.trim() === '') {
            return;
        }

        if (team === 'team1') {
        setSelectedPlayersTeam1((prev) => {
            const newArray = [...prev];
            newArray[index] = value;
            return newArray;
        });
        //console.log(selectedPlayersTeam1)
        } else if (team === 'team2') {
        setSelectedPlayersTeam2((prev) => {
            const newArray = [...prev];
            newArray[index] = value;
            return newArray;
        });
        console.log(selectedPlayersTeam2)
        }
    };
    const handleSelectChangeT = (index, team) => (event) => {
        const value = event.target.value;

        if (value.trim() === '') {
            return;
        }

        if (team === 'team1') {
        setMomentGolTeam1((prev) => {
            const newArray = [...prev];
            newArray[index] = value;
            return newArray;
        });
        //console.log(selectedPlayersTeam1)
        } else if (team === 'team2') {
        setMomentGolTeam2((prev) => {
            const newArray = [...prev];
            newArray[index] = value;
            return newArray;
        });
        console.log(momentGolTeam2)
        }
    };
    
    async function handleUpdate(){
        if(p1Part === p2Part){
            alert('Deve haver ao menos um vencedor')
            console.log(data.fk_comp)
            return;
        }

        console.log(selectedPlayersTeam1)
        console.log(selectedPlayersTeam2)

        const newWinner = p1Part > p2Part ? data.fk_time1 : data.fk_time2;

        try {
            const apiClient = setupAPIClient();
            await apiClient.put('/match', {
                id_part: data.id_part,
                data_part: dataPart,
                horario_part: horaPart,
                local_part: localPart,
                placar_time1: p1Part,
                placar_time2: p2Part,
                winner: newWinner,
                status: false
            })
            alert('Partida salva')

            // Recupera o valor atual do localStorage
            const storedMatchesString = localStorage.getItem('storedMatches');

            // Verifica se há um valor existente
            if (storedMatchesString) {
            // Se houver, converte para um array
            const currentMatches = JSON.parse(storedMatchesString);

            // Adiciona o novo item ao array
            currentMatches.push(newWinner);

            // Salva o novo valor
            localStorage.setItem('storedMatches', JSON.stringify(currentMatches));

            for (let i = 0; i < selectedPlayersTeam1.length; i++) {
                const jogadorId = selectedPlayersTeam1[i];
                const momentoGol = momentGolTeam1[i];
            
                // Certifique-se de que o jogadorId não é uma string vazia
                if (jogadorId.trim() !== '') {
                    await apiClient.post('/moment', {
                        tempo_partida: momentoGol, // Use o momentoGol correspondente
                        fk_part: data.id_part,
                        fk_jogador: jogadorId
                    });
                }
            }
            
            for (let i = 0; i < selectedPlayersTeam2.length; i++) {
                const jogadorId = selectedPlayersTeam2[i];
                const momentoGol = momentGolTeam2[i];
            
                // Certifique-se de que o jogadorId não é uma string vazia
                if (jogadorId.trim() !== '') {
                    await apiClient.post('/moment', {
                        tempo_partida: momentoGol, // Use o momentoGol correspondente
                        fk_part: data.id_part,
                        fk_jogador: jogadorId
                    });
                }
            }
            
            // await apiClient.post('/moment', {
            //     tempo_partida: '',
            //     fk_part: data.id_part,
            //     fk_jogador: item_do_array
            // })

            await apiClient.post('/statistic', {
                cartao: cardT1,
                chutes: chuteT1,
                escanteios: escanteioT1,
                posse_bola: posseT1,
                fk_time: data.fk_time1,
                fk_partida: data.id_part
            })
            await apiClient.post('/statistic', {
                cartao: cardT2,
                chutes: chuteT2,
                escanteios: escanteioT2,
                posse_bola: posseT2,
                fk_time: data.fk_time2,
                fk_partida: data.id_part
            })

            } else {
            // Se não houver um valor existente, simplesmente salva o novo valor como um array
            localStorage.setItem('storedMatches', JSON.stringify([newWinner]));
            }

            localStorage.setItem('idCompeticao', JSON.stringify([data.fk_comp]));

            Router.reload()
        } catch (error) {
            console.log(error)
            alert('Erro ao atualizar')
        }
    }
    async function onChangeP1(e: ChangeEvent<HTMLInputElement>){
        const trimmedValue = e.target.value.trim();
        setP1Part(trimmedValue)
        const apiClients = setupAPIClient();

        const responseTeam1 = await apiClients.get('/footballer', {
            params: { fk_time: data.fk_time1 }
        });
        setPlayersTeam1(responseTeam1.data);
    }

    async function onChangeP2(e: ChangeEvent<HTMLInputElement>){
        const trimmedValue = e.target.value.trim();
        setP2Part(trimmedValue)
        const apiClients = setupAPIClient();

        const responseTeam2 = await apiClients.get('/footballer', {
            params: { fk_time: data.fk_time2 }
        });
        setPlayersTeam2(responseTeam2.data);
    }
    
    return(
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent bg="system.400">
                <ModalHeader color="white">Adicionar partida</ModalHeader>
                <ModalCloseButton/>

                <ModalBody>
                    <Flex align="left" mb={3} direction="column"> 
                        <Flex direction="row" w="100%">
                            <Input 
                                placeholder="Data da partida"
                                w="85%"
                                size="lg"
                                mb={3}
                                mr={3}
                                type="date"
                                bg="system.900"
                                color="white"
                                value={dataPart}
                                onChange={(e) => setDataPart(e.target.value)}
                            />
                            <Input 
                                placeholder="Hora da partida"
                                w="85%"
                                size="lg"
                                mb={3}
                                type="time"
                                bg="system.900"
                                color="white"
                                value={horaPart}
                                onChange={(e) => setHoraPart(e.target.value)}
                            />
                        </Flex>
                        <Flex direction="row" w="100%">
                            <Input 
                                placeholder="Local da partida"
                                w="100%"
                                size="lg"
                                mb={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={localPart}
                                onChange={(e) => setLocalPart(e.target.value)}
                                />
                        </Flex>
                        <Flex direction="row" w="100%">
                            <Input
                                placeholder="Cartões no jogo"
                                w="85%"
                                size="lg"
                                mb={3}
                                mr={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={cardT1}
                                onChange={ (e) => setCardT1(e.target.value) }
                            />
                            <Input
                                placeholder="Cartões no jogo"
                                w="85%"
                                size="lg"
                                mb={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={cardT2}
                                onChange={ (e) => setCardT2(e.target.value) }
                            />
                        </Flex>
                        <Flex direction="row" w="100%">
                            <Input
                                placeholder="Chutes ao gol"
                                w="85%"
                                size="lg"
                                mb={3}
                                mr={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={chuteT1}
                                onChange={ (e) => setChuteT1(e.target.value) }
                            />
                            <Input
                                placeholder="Chutes ao gol"
                                w="85%"
                                size="lg"
                                mb={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={chuteT2}
                                onChange={ (e) => setChuteT2(e.target.value) }
                            />
                        </Flex>
                        <Flex direction="row" w="100%">
                            <Input
                                placeholder="Escanteios"
                                w="85%"
                                size="lg"
                                mb={3}
                                mr={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={escanteioT1}
                                onChange={ (e) => setEscanteioT1(e.target.value) }
                            />
                            <Input
                                placeholder="Escanteios"
                                w="85%"
                                size="lg"
                                mb={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={escanteioT2}
                                onChange={ (e) => setEscanteioT2(e.target.value) }
                            />
                        </Flex>
                        <Flex direction="row" w="100%">
                            <Input
                                placeholder="Posse de bola"
                                w="85%"
                                size="lg"
                                mb={3}
                                mr={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={posseT1}
                                onChange={ (e) => setPosseT1(e.target.value) }
                            />
                            <Input
                                placeholder="Posse de bola"
                                w="85%"
                                size="lg"
                                mb={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={posseT2}
                                onChange={ (e) => setPosseT2(e.target.value) }
                            />
                        </Flex>
                        <Flex direction="row" w="100%">
                            <Input
                                placeholder="Placar Time 1"
                                w="85%"
                                size="lg"
                                mb={3}
                                mr={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={p1Part}
                                onChange={ (e: ChangeEvent<HTMLInputElement>) => onChangeP1(e) }
                            />
                            <Input
                                placeholder="Placar Time 2"
                                w="85%"
                                size="lg"
                                mb={3}
                                type="text"
                                bg="system.900"
                                color="white"
                                value={p2Part}
                                onChange={ (e: ChangeEvent<HTMLInputElement>) => onChangeP2(e) }
                            />
                        </Flex>
                        <Flex direction="row" w="100%">
                            <Flex direction="column" w="100%">
                                <Text color="white">Autor do Gol - Time 1</Text>
                                {Array.from({ length: parseInt(p1Part) }, (_, index) => (
                                    <React.Fragment key={`element_${index}`}>
                                        <Flex direction="row" w="100%">
                                        <Select
                                            key={`element_${index}`}
                                            placeholder={`T'`}
                                            w="50%"
                                            size="lg"
                                            mb={3}
                                            mr={2}
                                            bg="system.900"
                                            color="white"
                                            value={setMomentGolTeam1[index]}
                                            onChange={handleSelectChangeT(index, 'team1')}
                                        >
                                            <option value="" disabled hidden>
                                            Selecione um jogador
                                            </option>
                                            {Array.from({ length: 90 }, (_, i) => (
                                            <option key={`option_${i}`} value={i + 1}>
                                                {i + 1}
                                            </option>
                                            ))}
                                        </Select>
                                        <Select
                                            placeholder={`Gol ${index + 1} - Time 1`}
                                            w="85%"
                                            size="lg"
                                            mb={3}
                                            bg="system.900"
                                            color="white"
                                            value={selectedPlayersTeam1[index]}
                                            onChange={handleSelectChange(index, 'team1')}
                                        >
                                        <option value="" disabled hidden>
                                            Selecione um jogador
                                        </option>
                                        {playersTeam1.map(player => (
                                            <option key={player.id_jogador} value={player.id_jogador}>
                                            {player.nome_jogador}
                                            </option>
                                        ))}
                                        </Select>
                                        </Flex>
                                    </React.Fragment>
                                ))}
                            </Flex>
                            <Flex direction="column" w="100%" ml={3}>
                                <Text color="white">Autor do Gol - Time 2</Text>
                                    {Array.from({ length: parseInt(p2Part) }, (_, index) => (
                                        <React.Fragment key={`element_${index}`}>
                                            <Flex direction="row" w="100%">
                                            <Select
                                                key={`element_${index}`}
                                                placeholder={`T'`}
                                                w="50%"
                                                size="lg"
                                                mb={3}
                                                mr={2}
                                                bg="system.900"
                                                color="white"
                                                value={setMomentGolTeam2[index]}
                                                onChange={handleSelectChangeT(index, 'team2')}
                                            >
                                                <option value="" disabled hidden>
                                                Selecione um jogador
                                                </option>
                                                {Array.from({ length: 90 }, (_, i) => (
                                                <option key={`option_${i}`} value={i + 1}>
                                                    {i + 1}
                                                </option>
                                                ))}
                                            </Select>
                                            <Select
                                                placeholder={`Gol ${index + 1} - Time 2`}
                                                w="85%"
                                                size="lg"
                                                mb={3}
                                                bg="system.900"
                                                color="white"
                                                value={selectedPlayersTeam2[index]}
                                                onChange={handleSelectChange(index, 'team2')}
                                            >
                                            <option value="" disabled hidden>
                                                Selecione um jogador
                                            </option>
                                            {playersTeam2.map(player => (
                                                <option key={player.id_jogador} value={player.id_jogador}>
                                                {player.nome_jogador}
                                                </option>
                                            ))}
                                            </Select>
                                            </Flex>
                                        </React.Fragment>
                                    ))}
                            </Flex>
                        </Flex>


                    </Flex>
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