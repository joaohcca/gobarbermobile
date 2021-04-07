import React from 'react';
import {
     Image,
     View,
     ScrollView,
     KeyboardAvoidingView,
     Platform,}
from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

import Input from '../../components/Input';
import Button from '../../components/Button';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

const SignUp: React.FC = () => {
    const navigation = useNavigation();

    return (
        <>
        <KeyboardAvoidingView
            style={{ flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding': undefined}
            enabled
        >
        <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{flex: 1}}
        >
        <Container>
            <Image source={logoImg} />

            <View>
                <Title>Crie sua Conta</Title>
            </View>

            <Input name="nome" icon="user" placeholder="Nome"/>

            <Input name="email" icon="mail" placeholder="E-mail"/>

            <Input name="password" icon="lock" placeholder="Senha" />

            <Button onPress={() => {console.log('lol')}}>
                Cadastrar
            </Button>


        </Container>
        <BackToSignIn onPress={ () => navigation.goBack()}>
            <Icon name="arrow-left" size={20} color="#fff"/>
            <BackToSignInText>
                Voltar para logon
            </BackToSignInText>

        </BackToSignIn>
        </ScrollView>
        </KeyboardAvoidingView>
        </>
    );
}

export default SignUp;

