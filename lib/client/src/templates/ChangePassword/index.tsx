import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { FormHandles } from '@unform/core';
import { ValidationError } from 'yup';
import { toast } from 'sonner';
import Image from 'next/image';

import Heading from 'components/Heading';
import Button from 'components/Button';
import TextInput from 'components/TextInput';

import { SystemBackground } from 'models/SystemBackground';

import { changePasswordSchema } from './rules/schema';

import * as S from './styles';
import { isUrl } from 'utils/isUrl';
import { useSession, useUser } from 'requests/queries/session';
import { unstable__api } from 'services/api';

type ChangePasswordFormData = {
  newPassword: string;
  passwordConfirmation: string;
};

export type ChangePasswordProps = {
  background?: SystemBackground;
};

const ChangePassword = ({ background }: ChangePasswordProps) => {
  const [loading, setLoading] = useState(false);

  const { data: user } = useUser();

  const formRef = useRef<FormHandles>(null);
  const { push, query } = useRouter();

  const handleSubmit = async (values: ChangePasswordFormData) => {
    setLoading(true);
    try {
      formRef.current?.setErrors({});

      await changePasswordSchema.validate(values, { abortEarly: false });

      await unstable__api.put(`/users/${user?.id}/password`, {
        password: values.newPassword
      });

      toast.success('Senha criada com sucesso.', {
        position: 'top-right'
      });

      return push(`${query?.callbackUrl || '/auth'}`);
    } catch (err) {
      if (err instanceof ValidationError) {
        const validationErrors: Record<string, string> = {};

        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });

        formRef.current?.setErrors(validationErrors);
      } else {
        toast.error('Não foi possível salvar sua nova senha!', {
          position: 'top-right'
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
        <S.UserContent>
          <Heading>Criar senha</Heading>
          <S.UserImageContainer>
            <Image
              src="/img/user2.png"
              layout="fill"
              objectFit="cover"
              quality={80}
              sizes="80px"
              alt={user?.username || undefined}
            />
          </S.UserImageContainer>
          <span>{user?.username}</span>
        </S.UserContent>

        <span>
          Olá {user?.username}, para acessar o portal você precisa criar uma
          nova senha!
        </span>

        <S.Form onSubmit={handleSubmit} ref={formRef}>
          <TextInput
            name="newPassword"
            label="Digite sua nova senha"
            type="password"
          />
          <TextInput
            name="passwordConfirmation"
            label="Confirme sua nova senha"
            type="password"
          />
          <Button styleType="normal" size="large" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar senha'}
          </Button>
        </S.Form>
      </S.Content>
    </S.Wrapper>
  );
};

export default ChangePassword;
