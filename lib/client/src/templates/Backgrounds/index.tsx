import { useMemo } from 'react';
import Image from 'next/image';
import { useQueryClient } from 'react-query';
import { Check } from '@styled-icons/feather';

import Base from 'templates/Base';

import Heading from 'components/Heading';

import { SystemBackground } from 'models/SystemBackground';

import {
  useListSystemBackgrounds,
  systemBackgroundKeys
} from 'requests/queries/system-backgrounds';
import {
  useChangeCurrentSystemBackgroundMutation,
  useCreateCurrentSystemBackgroundMutation,
  useDeleteSystemBackgroundMutation
} from 'requests/mutations/system-backgrounds';

import * as S from './styles';

const BackgroundsTemplate = () => {
  const queryClient = useQueryClient();

  const { data: backgrounds = [] } = useListSystemBackgrounds();

  const createSystemBackground = useCreateCurrentSystemBackgroundMutation();
  const changeSystemBackground = useChangeCurrentSystemBackgroundMutation();
  const deleteSystemBackground = useDeleteSystemBackgroundMutation();

  const handleChangeSystemBackground = async ({
    current_defined,
    id
  }: SystemBackground) => {
    const message = current_defined
      ? 'Deseja remover essa imagem do plano de fundo?'
      : 'Deseja definir essa imagem como plano de fundo?';

    const confirm = window.confirm(message);
    if (!confirm) return;

    await changeSystemBackground.mutateAsync({
      system_background_id: id,
      is_defined: !current_defined
    });

    queryClient.invalidateQueries(systemBackgroundKeys.lists());
  };

  const handleAddSystemBackground = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target;
    const file = input.files?.item(0);

    await createSystemBackground.mutateAsync({
      image: file
    });

    queryClient.invalidateQueries(systemBackgroundKeys.lists());
    input.value = '';
  };

  const handleDeleteSystemBackground = async (
    systemBackground: SystemBackground
  ) => {
    const confirm = window.confirm(`Deseja apagar essa imagem?`);
    if (!confirm) return;

    await deleteSystemBackground.mutateAsync(systemBackground);
    queryClient.invalidateQueries(systemBackgroundKeys.lists());
  };

  const ordenedBackgrounds = useMemo(() => {
    const newBackgrounds = [...backgrounds];

    const currentSelectedIndex = newBackgrounds.findIndex(
      ({ current_defined }) => !!current_defined
    );

    const selectedItem = newBackgrounds.splice(currentSelectedIndex, 1);

    return [...selectedItem, ...newBackgrounds];
  }, [backgrounds]);

  return (
    <Base>
      <Heading>Planos de fundo</Heading>

      <S.Wrapper>
        <S.CardItem isCurrent={false}>
          <S.AddImageButton title="Adicionar plano de fundo">
            <S.PlusIcon />
            <input type="file" onChange={handleAddSystemBackground} />
          </S.AddImageButton>
        </S.CardItem>
        {ordenedBackgrounds.map((background) => (
          <S.CardItem
            key={background.id}
            isCurrent={background.current_defined}
          >
            {background.current_defined && (
              <S.CheckContainer>
                <Check size={16} />
              </S.CheckContainer>
            )}

            <S.DeleteButton
              title="Apagar imagem"
              onClick={() => handleDeleteSystemBackground(background)}
            >
              <S.TrashIcon title="Apagar imagem" />
            </S.DeleteButton>

            <S.ImageContainer
              onClick={() => handleChangeSystemBackground(background)}
            >
              <Image
                src={background.image_url}
                layout="fill"
                objectFit="cover"
                quality={80}
                placeholder="blur-xs"
                blurDataURL={background.blurhash}
              />
              <S.ImageMessage>
                {background.current_defined
                  ? 'Remover do padrão'
                  : 'Definir como padrão'}
              </S.ImageMessage>
            </S.ImageContainer>
          </S.CardItem>
        ))}
      </S.Wrapper>
    </Base>
  );
};

export default BackgroundsTemplate;
