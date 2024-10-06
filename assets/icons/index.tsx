import { theme } from '@/lib/constants';
import { useColorScheme } from '@/lib/useColorScheme';

const icons: { [key: string]: React.ComponentType<any> } = {};

interface IconProps {
  name: string;
  size?: number;
  strokeWidth?: number;
  [key: string]: any;
}

const Icon = ({ name, ...props }: IconProps) => {
  const { isDarkColorScheme } = useColorScheme();
  const IconComponent = icons[name];
  return (
    <IconComponent
      height={props.size || 24}
      width={props.size || 24}
      strokeWidth={props.strokeWidth || 1.9}
      color={isDarkColorScheme ? 'light' : 'dark'}
      {...props}
    />
  );
};
