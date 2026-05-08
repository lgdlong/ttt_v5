import { AppShell, Group, ActionIcon, useMantineColorScheme, Anchor, Text } from '@mantine/core';
import { IconSun, IconMoon, IconPlayerPlayFilled } from '@tabler/icons-react';
import { Link } from "react-router";

const navItems = [
  { href: "/", label: "Trang chủ" },
  { href: "/admin", label: "Quản trị" },
]

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  return (
    <AppShell
      header={{ height: 60 }}
      padding={0}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group gap="xl">
            <Anchor component={Link} to="/" underline="never" c="inherit">
              <Group gap="xs">
                <IconPlayerPlayFilled size={24} style={{ color: 'var(--mantine-color-violet-6)' }} />
                <Text size="xl" fw={700}>TTT</Text>
              </Group>
            </Anchor>
            <Group gap="md">
              {navItems.map((item) => (
                <Anchor
                  key={item.href}
                  component={Link}
                  to={item.href}
                  c="dimmed"
                  fw={500}
                  underline="never"
                >
                  {item.label}
                </Anchor>
              ))}
            </Group>
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

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  )
}