import { FileText } from '@styled-icons/feather';

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
      `${process.env.NEXT_PUBLIC_APP_URL}/api/reports/class-diary`
    );
    url.searchParams.append('classroom_id', classroomId);
    url.searchParams.append('extension', extension);

    return url.toString();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <S.ActionButton title="Imprimir relatório final">
          <FileText title="Imprimir relatório final" />
        </S.ActionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Formatos</DropdownMenuLabel>
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <a target="_blank" href={createUrl('pdf')} rel="noreferrer">
            PDF
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:cursor-pointer" asChild>
          <a target="_blank" href={createUrl('xlsx')} rel="noreferrer">
            Excel
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
