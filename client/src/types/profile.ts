export interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactElement;
  onPress?: () => void;
  rightComponent?: React.ReactElement;
  subtitle?: string;
  danger?: boolean;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}