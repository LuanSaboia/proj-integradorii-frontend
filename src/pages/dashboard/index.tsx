import Head from "next/head";
import { Flex, Text } from "@chakra-ui/react";

import { canSSRAuth } from "@/utils/canSSRAuth";
import { Sidebar } from "@/components/sidebar";


export default function Dashboard(){
    return(
        <>
            <Head>
                <title>Meus campeoantos</title>
            </Head>
            <Sidebar>
                <Flex>
                    <Text>Bem vindo</Text>
                </Flex>
            </Sidebar>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    return {
        props:{
            
        }
    }
})