import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Check, ChevronsUpDown } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from 'components/shadcn/popover';
import { Button } from 'components/shadcn/button';
import { Command, CommandItem } from 'components/shadcn/command';

import { useListSchoolYears } from 'requests/queries/school-year';
import {
  fetchAllSession,
  useProfile,
  useSessionSchoolYear
} from 'requests/queries/session';
import { refreshSession } from 'requests/mutations/session';

import { cn } from 'utils/cnHelper';

const SchoolYearSelector = (): JSX.Element => {
  const [open, setOpen] = useState(false);

  const { push } = useRouter();

  const { data: currentSchoolYear } = useSessionSchoolYear();
  const { data: profile } = useProfile();

  const { data: schoolYears } = useListSchoolYears();

  const handleChangeSchoolYear = async (schoolyearId: string) => {
    if (schoolyearId === currentSchoolYear?.id) {
      setOpen(false);
      return;
    }

    await refreshSession({
      schoolYearId: schoolyearId,
      profileId: profile?.id
    });
    await fetchAllSession();

    setOpen(false);
    push('/auth');
  };

  const ordenedSchoolYears = useMemo(() => {
    return schoolYears?.sort(
      (a, b) => Number(b.reference_year) - Number(a.reference_year)
    );
  }, [schoolYears]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-auto justify-between"
        >
          {currentSchoolYear
            ? currentSchoolYear.reference_year
            : 'Selecione um ano letivo'}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[20rem] p-0">
        <Command>
          {ordenedSchoolYears?.map((schoolYear) => (
            <CommandItem
              key={schoolYear.id}
              onSelect={() => handleChangeSchoolYear(schoolYear.id)}
              className="hover:cursor-pointer"
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  schoolYear.id === currentSchoolYear?.id
                    ? 'opacity-100'
                    : 'opacity-0'
                )}
              />
              {schoolYear.reference_year}
            </CommandItem>
          ))}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SchoolYearSelector;
