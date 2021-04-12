import React, { useRef, useCallback } from 'react';
import {
     Image,
     View,
     ScrollView,
     KeyboardAvoidingView,
     Platform,
    TextInput,
    Alert,
    }
from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core"
import * as Yup from 'yup';

import getValidationErrors from '../../utils/getValidationErros'
import Input from '../../components/Input';
import Button from '../../components/Button';
import api from '../../services/api';

import logoImg from '../../assets/logo.png';

import { Container, Title, BackToSignIn, BackToSignInText } from './styles';

interface SignUpFormData {
    email: string;
    name: string;
    password: string;
}

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null)
    const navigation = useNavigation();

    const emailInputRef = useRef<TextInput>(null)
    const passwordInputRef = useRef<TextInput>(null)

    const handleSignUp = useCallback(
        async (data: SignUpFormData) => {
          try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
              name: Yup.string().required('Nome obrigatório'),
              email: Yup.string()
                .email('E-mail inválido')
                .required('E-mail obrigatório'),
              password: Yup.string().min(6, 'Mínimo 6 dígitos'),
            });

            await schema.validate(data, {
              abortEarly: false,
            });

            await api.post('/users', data);

            Alert.alert('Cadastro Realizado com sucesso!','Você já pode fazer o seu logon no goBarber')
            navigation.goBack();

          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              const errors = getValidationErrors(err);

              formRef.current?.setErrors(errors);
            }
            Alert.alert('Erro no Cadastro','Ocorreu um erro ao cadastrar as suas credenciais')

          }
        },
        [navigation],
      );
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
            <Form ref={formRef} onSubmit={handleSignUp}>
                <Input
                    autoCapitalize="words"
                    name="name"
                    icon="user"
                    placeholder="Nome"
                    returnKeyType="next"
                    onSubmitEditing={() => emailInputRef.current?.focus()}
                />

                <Input
                    ref={emailInputRef}
                    keyboardType="email-address"
                    autoCorrect={false}
                    autoCapitalize="none"
                    name="email"
                    icon="mail"
                    placeholder="E-mail"
                    returnKeyType="next"
                    onSubmitEditing={() => passwordInputRef.current?.focus()}

                />

                <Input
                    ref={passwordInputRef}
                    secureTextEntry
                    textContentType="newPassword"
                    name="password"
                    icon="lock"
                    placeholder="Senha"
                    returnKeyType="send"
                    onSubmitEditing={() => formRef.current?.submitForm()}
                />

                <Button onPress={() => formRef.current?.submitForm()}>
                    Cadastrar
                </Button>
            </Form>

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

