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
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";

interface MatchInfo{
    data_part: string,
    horario_part: string,
    local_part: string,
    placar_time1: string,
    placar_time2: string,
    fk_comp: string,
    fk_time1: string,
    fk_time2: string,
}

interface MatchProps{
    matches: MatchInfo[]
}

export default function Match({ matches }: MatchProps){
    console.log(matches)
    return(
        <>
            <Head>
                <title>Partidas</title>
            </Head>
            <Sidebar>

            </Sidebar>
        </>
    )
}

// ... (seu código anterior)

export const getServerSideProps = canSSRAuth(async (ctx) => {
    try {
        const idComp = localStorage.getItem("idCompeticao")

        if (!idComp) {
            return {
                redirect: {
                    destination: '/championship',
                    permanent: false
                }
            }
        }
        console.log(idComp);


        const apiClient = setupAPIClient();
        const response = await apiClient.get('/match/championship', {
            params: {
                fk_comp: idComp
            }
        });

        console.log(response.data);

        return {
            props: {
                matches: response.data
            }
        };
    } catch (error) {
        console.error(error);

        return {
            props: {
                matches: [] // Pode ser uma array vazia ou algum valor padrão, dependendo do seu caso
            }
        };
    }
});
