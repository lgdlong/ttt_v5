import {
  Group,
  Button,
  UnstyledButton,
  Text,
  Menu,
  Avatar,
  useMantineColorScheme,
  ActionIcon,
  Container,
  Burger,
  Anchor,
  Box,
  Stack,
  Drawer,
  ScrollArea,
  NavLink,
  Divider,
  Paper,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconSun,
  IconMoon,
  IconPlayerPlayFilled,
  IconChevronDown,
  IconUser,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';
import { Link } from 'react-router';
import { useSession, signOut } from '@/lib/auth-client';
import classes from './header.module.css';

export function Header() {
  const [opened, { toggle }] = useDisclosure(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { data: session, isPending } = useSession();

  const user = session?.user;

  return (
    <header className={classes.header}>
      <Container size="100%" h="100%" px="md">
        <Group justify="space-between" h="100%">
          <Group gap="xl">
            <Anchor component={Link} to="/" underline="never" c="inherit">
              <Group gap="xs">
                <IconPlayerPlayFilled
                  size={28}
                  style={{ color: 'var(--mantine-color-earth-6)' }}
                />
                <Text size="xl" fw={800} className={classes.logoText}>
                  TTT
                </Text>
              </Group>
            </Anchor>


          </Group>

          <Group>
            <Group gap={10} visibleFrom="sm">
              <ActionIcon
                variant="default"
                onClick={() => toggleColorScheme()}
                size="lg"
                aria-label="Toggle dark mode"
              >
                {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>

              {!isPending && (
                <>
                  {user ? (
                    // Menu user profile
                    <Menu
                      width={200}
                      position="bottom-end"
                      transitionProps={{ transition: 'pop-top-right' }}
                      withinPortal
                    >
                      <Menu.Target>
                        <UnstyledButton className={classes.user}>
                          <Group gap={7}>
                            <Avatar
                              src={user.image}
                              alt={user.name}
                              radius="xl"
                              size={24}
                            />
                            <Text fw={500} size="sm" lh={1} mr={3}>
                              {user.name}
                            </Text>
                            <IconChevronDown size={12} stroke={1.5} />
                          </Group>
                        </UnstyledButton>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Label>Tài khoản</Menu.Label>
                        <Menu.Item
                          leftSection={<IconUser size={16} stroke={1.5} />}
                          component={Link}
                          to="/profile"
                        >
                          Hồ sơ cá nhân
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<IconSettings size={16} stroke={1.5} />}
                          component={Link}
                          to="/settings"
                        >
                          Cài đặt
                        </Menu.Item>

                        <Menu.Divider />

                        <Menu.Item
                          color="red"
                          leftSection={<IconLogout size={16} stroke={1.5} />}
                          onClick={() => signOut()}
                        >
                          Đăng xuất
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  ) : (
                    <Button variant="default" component={Link} to="/login">
                      Đăng nhập
                    </Button>
                  )}
                </>
              )}
            </Group>

            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          </Group>
        </Group>
      </Container>

      {/* Mobile navigation Drawer */}
      <Drawer
        opened={opened}
        onClose={toggle}
        size="100%"
        padding="md"
        title={
          <Group gap="xs">
            <IconPlayerPlayFilled size={24} style={{ color: 'var(--mantine-color-earth-6)' }} />
            <Text fw={800} size="lg" className={classes.logoText}>TTT</Text>
          </Group>
        }
        hiddenFrom="sm"
        zIndex={1000}
      >
        <ScrollArea h={`calc(100vh - ${rem(80)})`} mx="-md">

          <Divider my="sm" label="Tài khoản" labelPosition="center" />
          
          <Box px="md" py="md">
            {!isPending && (
              <>
                {user ? (
                  <Stack gap="md">
                    <Paper withBorder p="md" radius="md" bg="var(--mantine-color-default-hover)">
                      <Group gap="sm">
                        <Avatar src={user.image} alt={user.name} radius="xl" size={40} />
                        <Box style={{ flex: 1 }}>
                          <Text size="sm" fw={700}>{user.name}</Text>
                          <Text size="xs" c="dimmed" truncate>{user.email}</Text>
                        </Box>
                      </Group>
                    </Paper>
                    
                    <Stack gap={4}>
                      <NavLink
                        label="Hồ sơ cá nhân"
                        leftSection={<IconUser size={rem(18)} stroke={1.5} />}
                        component={Link}
                        to="/profile"
                        onClick={toggle}
                      />
                      <NavLink
                        label="Cài đặt"
                        leftSection={<IconSettings size={rem(18)} stroke={1.5} />}
                        component={Link}
                        to="/settings"
                        onClick={toggle}
                      />
                      <NavLink
                        label="Đăng xuất"
                        leftSection={<IconLogout size={rem(18)} stroke={1.5} />}
                        onClick={() => { signOut(); toggle(); }}
                        styles={{
                          label: { color: 'var(--mantine-color-red-6)', fontWeight: 600 },
                          section: { color: 'var(--mantine-color-red-6)' },
                        }}
                      />
                    </Stack>
                  </Stack>
                ) : (
                  <Button variant="filled" component={Link} to="/login" onClick={toggle} fullWidth radius="md" size="md">
                    Đăng nhập
                  </Button>
                )}
              </>
            )}
          </Box>

          <Divider my="sm" label="Cài đặt hệ thống" labelPosition="center" />
          
          <Box px="md" py="md">
            <Group justify="space-between" className={classes.mobileSettingItem}>
              <Text size="sm" fw={500}>Giao diện</Text>
              <ActionIcon
                variant="default"
                onClick={() => toggleColorScheme()}
                size="lg"
                radius="md"
              >
                {colorScheme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
              </ActionIcon>
            </Group>
          </Box>
        </ScrollArea>
      </Drawer>
    </header>
  );
}
