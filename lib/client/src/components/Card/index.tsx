import Link from 'next/link';

import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as ShadCnCard
} from 'components/shadcn/ui/card';

import { withAccessComponent } from 'hooks/AccessProvider';

import { Button } from 'components/shadcn/button';

export type CardProps = {
  children?: React.ReactNode;
  description: string;
  icon?: React.ReactNode;
  iconAlign?: 'right' | 'center' | 'left';
  link?: string;
  onClick?: () => void;
};

const Card = ({ children, description, icon, link, onClick }: CardProps) => {
  return (
    (<ShadCnCard className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">{description}</CardTitle>
        {!!icon && icon}
      </CardHeader>
      <CardContent>
        {(!!children || children === 0) && (
          <p className="text-2xl font-bold">{children}</p>
        )}
      </CardContent>
      <CardFooter className="flex-1 items-end">
        {link ? (
          <Button className="w-full py-0 px-0">
            <Link
              href={link}
              passHref
              className="w-full h-full flex items-center justify-center">
              
                acessar
              
            </Link>
          </Button>
        ) : (
          <>
            {onClick && (
              <Button className="w-full" onClick={onClick}>
                acessar
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </ShadCnCard>)
  );
};

export default withAccessComponent(Card);
