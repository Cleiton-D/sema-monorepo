import React, { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ValidationError } from 'yup';
import { FormHandles } from '@unform/core';
import { toast } from 'react-toastify';

import TextInput from 'components/TextInput';
import Heading from 'components/Heading';
import Button from 'components/Button';

import { SystemBackground } from 'models/SystemBackground';

import { fetchAllSession } from 'requests/queries/session';
import { createSession } from 'requests/mutations/session';

import { isUrl } from 'utils/isUrl';

import { signInSchema } from './rules/schema';

import Image from 'next/image';

import * as S from './styles';

export type SigninFormData = {
  email: string;
  password: string;
};

export type SignInProps = {
  background?: SystemBackground;
};

const SignIn = ({ background }: SignInProps) => {
  const [loading, setLoading] = useState(false);

  const { push, query } = useRouter();

  const formRef = useRef<FormHandles>(null);

  const handleSubmit = async (values: SigninFormData) => {
    setLoading(true);
    try {
      formRef.current?.setErrors({});

      await signInSchema.validate(values, {
        abortEarly: false
      });

      const queryCallbackUrl = (query?.callbackUrl as string) || '';

      const callbackUrl = isUrl(queryCallbackUrl)
        ? queryCallbackUrl
        : `${window.location.origin}${queryCallbackUrl || '/auth'}`;

      await createSession({ ...values });
      const [user] = await fetchAllSession();

      if (!user) {
        throw new Error('user not found');
      }

      if (user.change_password) {
        return push(`/auth/change-password?callbackUrl=${callbackUrl}`);
      }

      return push(callbackUrl);
    } catch (err) {
      if (err instanceof ValidationError) {
        const validationError: Record<string, string> = {};

        err.inner.forEach((error) => {
          if (error.path) {
            validationError[error.path] = error.message;
          }
        });

        formRef.current?.setErrors(validationError);
      } else {
        console.log(err);
        toast.error('Não foi possível efetuar o login!', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }

    setLoading(false);
  };

  return (
    <S.Wrapper hasBackground={!!background}>
      {background && (
        <S.Background
          src={background.image_url}
          layout="fill"
          objectFit="cover"
          quality={80}
          placeholder="blur"
          blurDataURL={background.blurhash}
        />
      )}

      <S.Content>
        <S.WfLogoContainer>
          <Image
            src="/img/logowf.gif"
            layout="fill"
            objectFit="contain"
            quality={80}
            sizes="120px"
          />
        </S.WfLogoContainer>
        <Heading color="secondary">Faça seu login</Heading>

        <S.Form onSubmit={handleSubmit} ref={formRef}>
          <TextInput name="email" label="Digite seu CPF" />
          <TextInput name="password" label="Digite sua senha" type="password" />
          <Button styleType="rounded" size="large" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </S.Form>
      </S.Content>
    </S.Wrapper>
  );
};

export default SignIn;
