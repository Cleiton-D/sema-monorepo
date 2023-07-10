import { Printer } from '@styled-icons/feather';
import { FiletypePdf, FiletypeXlsx } from '@styled-icons/bootstrap';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from 'components/shadcn/dropdown-menu';

import * as S from './styles';

type ActionMenuProps = {
  classroomId: string;
};
export const ActionMenu = ({ classroomId }: ActionMenuProps) => {
  const createUrl = (extension: string): string => {
    const url = new URL(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/reports/final-report`
    );
    url.searchParams.append('classroom_id', classroomId);
    url.searchParams.append('extension', extension);

    return url.toString();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <S.ActionButton title="Imprimir Ata">
          <Printer size={20} title="Imprimir Ata" />
        </S.ActionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Formatos</DropdownMenuLabel>
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <a target="_blank" href={createUrl('pdf')} rel="noreferrer">
            <FiletypePdf className="mr-2 h-5 w-5" />
            PDF
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <a target="_blank" href={createUrl('xlsx')} rel="noreferrer">
            <FiletypeXlsx className="mr-2 h-5 w-5" />
            Excel
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
