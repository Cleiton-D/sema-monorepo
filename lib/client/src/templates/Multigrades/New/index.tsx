import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';

import Base from 'templates/Base';

import Heading from 'components/Heading';
import Select from 'components/Select';
import MultigradeClassroomsCard from 'components/MultigradeClassroomsCard';
import Button from 'components/Button';

import { Multigrade } from 'models/Multigrade';

import { useListClassPeriods } from 'requests/queries/class-periods';
import { useShowMultigrade } from 'requests/queries/multigrades';
import { useAddMultigradeClassroom } from 'requests/mutations/multigrade-classrooms';
import { useAddMultigrade } from 'requests/mutations/multigrades';

import { translateDescription } from 'utils/mappers/classPeriodMapper';

import { classroomsAtom } from 'store/atoms/create-multigrade';

import DescriptionInput from './DescriptionInput';

import * as S from './styles';

type FormData = {
  description: string;
  class_period_id: string;
};

type NewMultigradeTemplateProps = {
  type: 'new' | 'update';
};
const NewMultigradeTemplate = ({ type }: NewMultigradeTemplateProps) => {
  const [selectedClassPeriod, setSelectedClassPeriod] = useState<string>();
  const [multigrade, setMultigrade] = useState<Multigrade>();
  const [saving, setSaving] = useState(false);

  const router = useRouter();
  const { data: session } = useSession();

  const { data: classPeriods, isLoading } = useListClassPeriods(session, {
    school_year_id: session?.configs.school_year_id
  });
  const { data: currentMultigrade } = useShowMultigrade(
    session,
    {
      multigrade_id: router.query.multigrade_id as string
    },
    {
      enabled: !!router.query.multigrade_id
    }
  );

  const [multigradesClassrooms, setMultigradesClassrooms] =
    useAtom(classroomsAtom);
  const resetClassrooms = useResetAtom(classroomsAtom);

  const schoolId = useMemo(() => {
    if (router.query.school_id === 'me') {
      return session?.schoolId;
    }
    return router.query.school_id as string;
  }, [router, session]);

  const addMultigrade = useAddMultigrade();
  const addMultigradeClassroom = useAddMultigradeClassroom();

  const submitClassrooms = async (savedMultigrade: Multigrade) => {
    const payloads = multigradesClassrooms.map(({ classroom }) => ({
      owner_id: savedMultigrade.id,
      classroom_id: classroom.id
    }));

    return addMultigradeClassroom.mutateAsync(payloads);
  };

  const handleSubmit = async ({ class_period_id, description }: FormData) => {
    setSaving(true);

    const response: Multigrade = await addMultigrade.mutateAsync({
      class_period_id,
      description,
      is_multigrade: true,
      school_id: schoolId
    });

    if (response.id) {
      if (!multigrade) {
        const savedClassrooms = await submitClassrooms(response);
        setMultigradesClassrooms(savedClassrooms);
      }

      setMultigrade(response);
    }

    setSaving(false);
  };

  const classPeriodsOptions = useMemo(() => {
    if (isLoading) return [{ label: 'Carregando...', value: '' }];
    if (!classPeriods) return [];

    return classPeriods.map((classPeriod) => ({
      value: classPeriod.id,
      label: translateDescription(classPeriod.description)
    }));
  }, [classPeriods, isLoading]);

  const resetForms = useCallback(() => {
    resetClassrooms();
  }, [resetClassrooms]);

  useEffect(() => {
    if (currentMultigrade) {
      setMultigrade(currentMultigrade);
      setSelectedClassPeriod(currentMultigrade.class_period_id);
    }
  }, [currentMultigrade]);

  useEffect(() => {
    router.events.on('routeChangeStart', resetForms);

    return () => {
      router.events.off('routeChangeStart', resetForms);
    };
  }, [router, resetForms]);

  const isDisabled =
    type === 'update' || (!!multigrade && !!multigradesClassrooms.length);

  return (
    <Base>
      <Heading>{type === 'new' ? 'Novo seriado' : 'Alterar seriado'}</Heading>
      <S.Content>
        <S.Wrapper>
          <S.Form onSubmit={handleSubmit} initialData={currentMultigrade}>
            <DescriptionInput
              pageType={type}
              defaultValue={currentMultigrade?.description}
              disabled={isDisabled}
            />
            <Select
              name="class_period_id"
              label="Período"
              options={classPeriodsOptions}
              disabled={isDisabled}
              onChange={setSelectedClassPeriod}
            />

            <S.ButtonContainer>
              <Button
                styleType="normal"
                size="medium"
                disabled={saving || isDisabled}
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </S.ButtonContainer>
          </S.Form>
        </S.Wrapper>

        <S.ClassroomsContainer>
          <MultigradeClassroomsCard
            schoolId={schoolId}
            classPeriodId={selectedClassPeriod}
            multigradeId={multigrade?.id}
          />
        </S.ClassroomsContainer>
      </S.Content>

      <S.FinishButtonContainer>
        <Button
          onClick={() =>
            router.push(`/auth/school/${router.query.school_id}/multigrades`)
          }
          type="button"
        >
          Finalizar
        </Button>
      </S.FinishButtonContainer>
    </Base>
  );
};

export default NewMultigradeTemplate;
