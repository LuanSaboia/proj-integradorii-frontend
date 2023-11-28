import { ReactNode } from "react";
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    Drawer,
    DrawerContent,
    useColorModeValue,
    Text,
    useDisclosure, 
    BoxProps,
    FlexProps
} from '@chakra-ui/react'

import {
    FiSettings,
    FiMenu,
    FiHome,
    FiUser
} from 'react-icons/fi'
import { 
    IoMdFootball,
    IoMdPodium
} from "react-icons/io"
import { IconType } from "react-icons";

import Link from "next/link";

interface LinkItemProps{
    name: string;
    icon: IconType;
    route: string;
}

const LinkItems: Array<LinkItemProps> = [
    { name: 'Inicio', icon: FiHome, route: '/dashboard'},
    { name: 'Campeonatos', icon: IoMdPodium, route: '/championship'},
    // { name: 'Partidas', icon: IoMdFootball, route: '/dashboard'},
    { name: 'Times', icon: FiHome, route: '/team'},
    { name: 'Jogadores', icon: FiUser, route: '/footballer'},
    { name: 'Minha Conta', icon: FiSettings, route: '/profile'},
]

export function Sidebar({children}: { children: ReactNode }){

    const { isOpen, onOpen, onClose } = useDisclosure();

    return(
        <Box minH="100vh" bg="system.900">
            <SidebarContent
                onClose={() => onClose}
                display={{ base: 'none', md: 'block' }}
            />

            <Drawer
                autoFocus={false}
                isOpen={isOpen}
                placement="left"
                returnFocusOnClose={false}
                onOverlayClick={onClose}
                size="full"
                onClose={onClose}
            >
                <DrawerContent>
                    <SidebarContent onClose={() => onClose()} />
                </DrawerContent>
                
            </Drawer>

            <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen}/>

            <Box ml={{ base:0, md: 60}} p={4}>
                {children}
            </Box>
        </Box>
    )
}

interface SiderbarProps extends BoxProps{
    onClose: () => void;
}

const SidebarContent = ({onClose, ...rest}: SiderbarProps)  => {
    return(
        <Box
            bg="system.400"
            color="white"
            borderRight="1px"
            borderRightColor={useColorModeValue('system.100', 'system.400')}
            w={{ base: 'full', md: 60}}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex h="20" alignItems="center" justifyContent="space-between" mx="8">
                <Link href={"/dashboard"}>
                    <Flex cursor="pointer" userSelect="none" flexDirection="row">
                        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">Sistema</Text>
                    </Flex>
                </Link>
                <CloseButton display={{ base: 'flex', md: 'none'}} onClick={onClose}/>
            </Flex>

            {LinkItems.map(link => (
                <NavItem icon={link.icon} route={link.route} key={link.name}>
                    {link.name}
                </NavItem>
            ))}

        </Box>
    )
}

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactNode;
    route: string
}

const NavItem = ({icon, children, route, ...rest}: NavItemProps) => {
    return(
        <Link href={route} style={{ textDecoration: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'white',
                    color: 'system.900'
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr={4}
                        fontSize="16"
                        as={icon}
                        _groupHover={{
                            color: 'system.900'
                        }}
                    />
                )}
                {children}
            </Flex>
        </Link>
    )
}

interface MobileProps extends FlexProps{
    onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
    return(
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('gray.900', 'white')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.500', 'gray.700')}
            justifyContent="flex-start"
            {...rest}
        >
            <IconButton
                variant="outline"
                onClick={onOpen}
                aria-label="open menu"
                color="white"
                _hover={{
                    bg: 'white',
                    color: 'system.900'
                }}
                icon={ <FiMenu/> }
            />

            <Flex flexDirection="row">
                <Text ml={8} fontSize="2xl" fontFamily="monospace" fontWeight="bold" color="white">Sistema</Text>
            </Flex>
        </Flex>
    )
}