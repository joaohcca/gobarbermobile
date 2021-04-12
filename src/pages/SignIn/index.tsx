import React, { useCallback,useRef } from 'react';
import {
     Image,
     View,
     Alert,
     ScrollView,
     KeyboardAvoidingView,
     Platform,
     TextInput,
    }
from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import { Form } from "@unform/mobile";
import { FormHandles} from "@unform/core";

import { useAuth } from '../../hooks/auth';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErros';

import logoImg from '../../assets/logo.png';

import { Container, Title, ForgotPassword, ForgotPasswordText, CreateAccountButton, CreateAccountButtonText } from './styles';

interface SignInFormData {
    email: string;
    password: string;
}

const SignIn: React.FC = () => {
    const formRef = useRef<FormHandles>(null)
    const passwordInputRef = useRef<TextInput>(null)
    const navigation = useNavigation();
    const { signIn } = useAuth();

    const handleSignIn = useCallback(
        // eslint-disable-next-line @typescript-eslint/ban-types
        async (data: SignInFormData) => {
          try {
            formRef.current?.setErrors({});

            const schema = Yup.object().shape({
              email: Yup.string()
                .email('E-mail inválido')
                .required('E-mail obrigatório'),
              password: Yup.string().required('Senha obrigatória'),
            });

            await schema.validate(data, {
              abortEarly: false,
            });

            await signIn({
              email: data.email,
              password: data.password,
            });
            Alert.alert('Bem-vindo(a)','last login @@')

          } catch (err) {
            if (err instanceof Yup.ValidationError) {
              const errors = getValidationErrors(err);

              formRef.current?.setErrors(errors);
              Alert.alert('Error de Autenticação','Verifique suas credenciais')
              return;
            }
          }
        },[signIn],
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
                <Title>Faça seu Logon</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignIn}>
                <Input
                    autoCorrect={false}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    name="email"
                    icon="mail"
                    placeholder="E-mail"
                    onSubmitEditing={ () => {
                        passwordInputRef.current?.focus();
                    }}
                />

                <Input
                    ref={passwordInputRef}
                    secureTextEntry
                    returnKeyType="send"
                    onSubmitEditing={
                        () => formRef.current?.submitForm()
                    }
                    name="password"
                    icon="lock"
                    placeholder="Senha"
                />

                <Button
                 onPress={() => formRef.current?.submitForm()
                }>
                    Entrar
                </Button>
            </Form>

            <ForgotPassword>
                <ForgotPasswordText onPress={() => {console.log('lol')}}>
                    Esqueci minha senha
                </ForgotPasswordText>

            </ForgotPassword>

        </Container>
        <CreateAccountButton onPress={() => navigation.navigate('SignUp')}>
            <Icon name="log-in" size={20} color="#ff9000"/>
            <CreateAccountButtonText>
                Criar uma conta
            </CreateAccountButtonText>

        </CreateAccountButton>
        </ScrollView>
        </KeyboardAvoidingView>
        </>
    );
}

export default SignIn;

