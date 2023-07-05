import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from 'components/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from 'components/shadcn/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from 'components/shadcn/popover';
import { Command, CommandGroup, CommandItem } from 'components/shadcn/command';

import { MinifiedAttendance } from 'models/Attendance';
import { EnrollClassroom } from 'models/EnrollClassroom';

import { useListEnrollClassrooms } from 'requests/queries/enroll-classrooms';
import { useAddAttendance } from 'requests/mutations/attendances';

import { cn } from 'utils/cnHelper';

type SingleStudentModalProps = {
  classroomId: string;
  classId: string;
  attendances: MinifiedAttendance[];
};
export const SingleStudentModal = ({
  classroomId,
  classId,
  attendances
}: SingleStudentModalProps) => {
  const [openSelector, setOpenSelector] = useState(false);
  const [open, setOpen] = useState(false);

  const [selectedEnroll, setSelectedEnroll] = useState<EnrollClassroom>();

  const queryClient = useQueryClient();

  const { data: enrollClassrooms } = useListEnrollClassrooms({
    classroom_id: classroomId
  });

  const addAttendance = useAddAttendance();
  const handleSubmit = useCallback(async () => {
    if (!selectedEnroll) return;

    await addAttendance.mutateAsync({
      class_id: classId,
      enroll_classroom_id: selectedEnroll?.id
    });

    queryClient.invalidateQueries(['list-attendances-by-classes']);
    setSelectedEnroll(undefined);
    setOpen(false);
  }, [addAttendance, classId, selectedEnroll, queryClient]);

  const enrollList = useMemo(() => {
    if (!enrollClassrooms) return [];

    return enrollClassrooms.filter(({ enroll_id }) => {
      return !attendances.find(
        (attendance) => attendance.enroll_id === enroll_id
      );
    });
  }, [attendances, enrollClassrooms]);

  const handleClose = useCallback((show: boolean) => {
    if (!show) {
      setSelectedEnroll(undefined);
    }
    setOpen(show);
  }, []);

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogTrigger asChild>
        <Button size="sm">Adicionar aluno avulso</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar aluno avulso</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Popover open={openSelector} onOpenChange={setOpenSelector}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSelector}
                className="w-full justify-between"
              >
                {selectedEnroll
                  ? selectedEnroll.enroll.student.name
                  : enrollList.length
                  ? 'selecione um aluno...'
                  : 'Nenhum aluno disponível'}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            {!!enrollList.length && (
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandGroup className="max-h-56	 overflow-auto">
                    {enrollList.map((enroll) => (
                      <CommandItem
                        key={enroll.enroll_id}
                        onSelect={() => {
                          setSelectedEnroll(enroll);
                          setOpenSelector(false);
                        }}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            enroll.id === selectedEnroll?.id
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        {enroll.enroll.student.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            )}
          </Popover>

          <Button disabled={!selectedEnroll} onClick={handleSubmit}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
