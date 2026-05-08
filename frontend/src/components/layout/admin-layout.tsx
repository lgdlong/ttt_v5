import { AppShell, Burger, Group, NavLink, ActionIcon, useMantineColorScheme, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDashboard, IconVideo, IconTags, IconSun, IconMoon } from '@tabler/icons-react';
import { Link, useLocation } from "react-router";
import { VI } from "@/lib/constants";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: IconDashboard },
  { href: "/admin/videos", label: "Video", icon: IconVideo },
  { href: "/admin/tags", label: VI.totalTags, icon: IconTags },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [opened, { toggle }] = useDisclosure()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="lg"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>TTT Admin</Title>
          </Group>
          <ActionIcon
            variant="default"
            onClick={() => toggleColorScheme()}
            size="lg"
            aria-label="Toggle dark mode"
          >
            {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            component={Link}
            to={item.href}
            label={item.label}
            leftSection={<item.icon size={20} stroke={1.5} />}
            active={location.pathname === item.href}
            variant="filled"
            style={{ borderRadius: '8px', marginBottom: '4px' }}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main bg="var(--mantine-color-gray-0)" darkHidden>
        {children}
      </AppShell.Main>
      <AppShell.Main bg="var(--mantine-color-dark-8)" lightHidden>
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
