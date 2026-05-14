import {
  Container,
  Paper,
  Text,
  Title,
  Avatar,
  Group,
  Stack,
  Button,
  TextInput,
  Divider,
  Badge,
  ActionIcon,
  rem,
  Tabs,
  Tooltip,
  Grid,
  Box,
  Modal,
  Alert,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router';
import { useSession, updateUser, deleteUser } from '@/lib/auth-client';
import { notifications } from '@mantine/notifications';
import {
  IconUser,
  IconShield,
  IconCalendar,
  IconEdit,
  IconCheck,
  IconX,
  IconLock,
  IconCamera,
  IconAt,
  IconExternalLink,
  IconAlertTriangle,
  IconTrash,
} from '@tabler/icons-react';

export function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const navigate = useNavigate();
  
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  const form = useForm({
    initialValues: {
      name: user?.name || '',
    },
    validate: {
      name: (val) => (val.length < 2 ? 'Tên quá ngắn' : null),
    },
  });

  if (!user) return null;

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : null;

  const handleUpdate = async (values: typeof form.values) => {
    setLoading(true);
    try {
      const { error } = await updateUser({
        name: values.name,
      });

      if (error) {
        notifications.show({
          title: 'Lỗi cập nhật',
          message: error.message || 'Không thể cập nhật hồ sơ',
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Thành công',
          message: 'Hồ sơ của bạn đã được cập nhật',
          color: 'green',
        });
        setEditing(false);
      }
    } catch (err: unknown) {
      const error = err as Error;
      notifications.show({
        title: 'Lỗi hệ thống',
        message: error.message || 'Đã có lỗi xảy ra',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const { error } = await deleteUser();

      if (error) {
        notifications.show({
          title: 'Lỗi xóa tài khoản',
          message: error.message || 'Không thể xóa tài khoản lúc này',
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Thành công',
          message: 'Tài khoản của bạn đã được xóa vĩnh viễn. Tạm biệt!',
          color: 'green',
        });
        closeDeleteModal();
        navigate('/', { replace: true });
      }
    } catch (err: unknown) {
      const error = err as Error;
      notifications.show({
        title: 'Lỗi hệ thống',
        message: error.message || 'Đã có lỗi xảy ra khi xóa tài khoản',
        color: 'red',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Container size="md" py={40}>
      <Stack gap="xl">
        <Group justify="space-between" align="flex-end">
          <Stack gap={4}>
            <Title order={1} fw={900} style={{ fontFamily: 'Merriweather, serif', fontSize: rem(40) }}>
              Hồ sơ cá nhân
            </Title>
            <Text c="dimmed" size="sm">
              Quản lý thông tin tài khoản và cài đặt bảo mật của bạn
            </Text>
          </Stack>
        </Group>

        <Tabs defaultValue="info" variant="pills" radius="md">
          <Tabs.List mb="xl">
            <Tabs.Tab value="info" leftSection={<IconUser size={16} />} px="xl" py="md">
              Thông tin cơ bản
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<IconLock size={16} />} px="xl" py="md">
              Bảo mật
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="info">
            <Stack gap="lg">
              <Paper withBorder p={0} radius="lg" shadow="sm" style={{ overflow: 'hidden' }}>
                {/* Header Profile Section with theme-aware background */}
                <Box 
                  py={40} 
                  px={30} 
                  style={{ 
                    background: 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))',
                    borderBottom: '1px solid var(--mantine-color-default-border)'
                  }}
                >
                  <Group justify="space-between" align="center">
                    <Group gap={25}>
                      <Box pos="relative">
                        <Avatar
                          src={user.image}
                          size={120}
                          radius={120}
                          style={{ border: '4px solid var(--mantine-color-earth-6)' }}
                        />
                        <Tooltip label="Thay đổi ảnh đại diện">
                          <ActionIcon
                            size="lg"
                            radius="xl"
                            variant="filled"
                            color="earth.6"
                            pos="absolute"
                            bottom={5}
                            right={5}
                            style={{ 
                              border: '2px solid light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))' 
                            }}
                            onClick={() => {
                              notifications.show({
                                title: 'Thông báo',
                                message: 'Tính năng thay đổi ảnh đang được phát triển',
                                color: 'blue',
                              });
                            }}
                          >
                            <IconCamera size={18} />
                          </ActionIcon>
                        </Tooltip>
                      </Box>
                      <Stack gap={5}>
                        <Group gap="xs">
                          <Title order={2} fw={800} size="h1">
                            {user.name}
                          </Title>
                          <Badge 
                            variant="dot" 
                            color={user.role === 'admin' ? 'red' : 'earth.6'} 
                            size="lg"
                            h={30}
                            px="md"
                          >
                            {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                          </Badge>
                        </Group>
                        <Group gap="xs">
                          <IconCalendar size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
                          <Text c="dimmed" size="sm" fw={500}>
                            Thành viên từ: {joinDate || 'N/A'}
                          </Text>
                        </Group>
                      </Stack>
                    </Group>

                    {!editing && (
                      <Button
                        variant="default"
                        leftSection={<IconEdit size={16} />}
                        onClick={() => {
                          form.setValues({ name: user.name });
                          setEditing(true);
                        }}
                        radius="md"
                        h={45}
                        px="xl"
                        style={{ 
                          transition: 'all 0.2s ease',
                          fontWeight: 600
                        }}
                      >
                        Chỉnh sửa
                      </Button>
                    )}
                  </Group>
                </Box>

                {/* Info Section */}
                <Box p={30}>
                  <form onSubmit={form.onSubmit(handleUpdate)}>
                    <Stack gap="xl">
                      <Grid gap="xl">
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Họ và tên"
                            description="Tên này sẽ được hiển thị công khai trên ứng dụng"
                            placeholder="Nhập tên của bạn"
                            leftSection={<IconUser size={18} stroke={1.5} />}
                            disabled={!editing}
                            {...form.getInputProps('name')}
                            radius="md"
                            size="md"
                            styles={{
                              label: { marginBottom: 8, fontWeight: 600 },
                              description: { marginBottom: 8 },
                              input: { 
                                height: 50,
                                fontSize: rem(16),
                                '&:disabled': {
                                  backgroundColor: 'light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-6))',
                                  opacity: 0.8,
                                }
                              }
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Địa chỉ Email"
                            description="Email dùng để đăng nhập và nhận thông báo"
                            value={user.email}
                            leftSection={<IconAt size={18} stroke={1.5} />}
                            disabled
                            radius="md"
                            size="md"
                            styles={{
                              label: { marginBottom: 8, fontWeight: 600 },
                              description: { marginBottom: 8 },
                              input: { 
                                height: 50,
                                fontSize: rem(16),
                                '&:disabled': {
                                  backgroundColor: 'var(--mantine-color-dark-6)',
                                  opacity: 0.8,
                                  cursor: 'not-allowed'
                                }
                              }
                            }}
                          />
                        </Grid.Col>
                      </Grid>

                      {editing && (
                        <Group justify="flex-end" mt="md">
                          <Button
                            variant="default"
                            color="gray"
                            leftSection={<IconX size={16} />}
                            onClick={() => setEditing(false)}
                            disabled={loading}
                            h={45}
                            radius="md"
                            style={{ fontWeight: 600 }}
                          >
                            Hủy
                          </Button>
                          <Button 
                            type="submit" 
                            variant="filled"
                            color="earth.6"
                            loading={loading} 
                            radius="md"
                            h={45}
                            px="xl"
                            leftSection={<IconCheck size={16} />}
                            style={{ 
                              border: '1px solid var(--mantine-color-earth-7)'
                            }}
                          >
                            Lưu thay đổi
                          </Button>
                        </Group>
                      )}
                    </Stack>
                  </form>
                </Box>
              </Paper>

              <Paper withBorder p={30} radius="lg" shadow="sm">
                <Group justify="space-between">
                  <Stack gap={5}>
                    <Text fw={700} size="lg">Kết nối tài khoản</Text>
                    <Text size="sm" c="dimmed">Liên kết với các dịch vụ bên thứ ba để đăng nhập nhanh hơn.</Text>
                  </Stack>
                  <Button 
                    variant="outline" 
                    radius="md" 
                    h={45}
                    px="xl"
                    leftSection={<IconExternalLink size={16} />}
                    style={{ fontWeight: 600 }}
                    onClick={() => {
                      notifications.show({
                        title: 'Thông báo',
                        message: 'Tính năng quản lý liên kết đang được phát triển',
                        color: 'blue',
                      });
                    }}
                  >
                    Quản lý liên kết
                  </Button>
                </Group>
              </Paper>
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="security">
            <Paper withBorder p={30} radius="lg" shadow="sm">
              <Stack gap="md">
                <Title order={3} fw={700}>Bảo mật tài khoản</Title>
                <Text size="sm" c="dimmed">Quản lý mật khẩu và các tùy chọn bảo mật khác để bảo vệ tài khoản của bạn.</Text>
                
                <Divider my="sm" />
                
                <Group justify="space-between" py="sm">
                  <Stack gap={0}>
                    <Group gap="xs">
                      <IconLock size={18} style={{ color: 'var(--mantine-color-earth-6)' }} />
                      <Text fw={600}>Mật khẩu</Text>
                    </Group>
                    <Text size="sm" c="dimmed">Thay đổi mật khẩu của bạn định kỳ để tăng tính bảo mật.</Text>
                  </Stack>
                  <Button 
                    variant="outline" 
                    radius="md"
                    h={45}
                    px="xl"
                    style={{ fontWeight: 600 }}
                    onClick={() => {
                      notifications.show({
                        title: 'Thông báo',
                        message: 'Tính năng đổi mật khẩu đang được phát triển',
                        color: 'blue',
                      });
                    }}
                  >
                    Đổi mật khẩu
                  </Button>
                </Group>
                
                <Divider my="sm" />
                
                <Group justify="space-between" py="sm">
                  <Stack gap={0}>
                    <Group gap="xs">
                      <IconShield size={18} style={{ color: 'var(--mantine-color-blue-6)' }} />
                      <Text fw={600}>Xác thực 2 lớp (2FA)</Text>
                    </Group>
                    <Text size="sm" c="dimmed">Thêm một lớp bảo mật bổ sung cho tài khoản của bạn.</Text>
                  </Stack>
                  <Badge color="gray" variant="light" size="lg" radius="sm">Chưa kích hoạt</Badge>
                </Group>

                <Divider my="sm" />

                <Box py="sm">
                  <Text fw={600} color="red" mb={5}>Vùng nguy hiểm</Text>
                  <Text size="sm" c="dimmed" mb="md">Xóa tài khoản của bạn và toàn bộ dữ liệu liên quan. Hành động này không thể hoàn tác.</Text>
                  <Button 
                    variant="outline" 
                    color="red" 
                    radius="md"
                    h={45}
                    px="xl"
                    leftSection={<IconTrash size={16} />}
                    onClick={openDeleteModal}
                    style={{ fontWeight: 600 }}
                  >
                    Xóa tài khoản
                  </Button>
                </Box>
              </Stack>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Stack>

      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={<Text fw={700}>Xác nhận xóa tài khoản</Text>}
        centered
        radius="md"
        size="md"
      >
        <Stack gap="md">
          <Alert color="red" icon={<IconAlertTriangle size={16} />} radius="md">
            Hành động này là vĩnh viễn và không thể khôi phục. Tất cả dữ liệu của bạn sẽ bị xóa sạch khỏi hệ thống.
          </Alert>

          <Text size="sm">
            Để tiếp tục, vui lòng gõ chính xác chuỗi "<Text component="span" fw={700} c="red">DELETE</Text>" vào ô bên dưới:
          </Text>

          <TextInput
            placeholder="Gõ DELETE để xác nhận"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.currentTarget.value)}
            radius="md"
            autoFocus
          />

          <Group justify="flex-end" mt="md">
            <Button 
              variant="default" 
              color="gray" 
              onClick={closeDeleteModal} 
              disabled={deleting}
              style={{ fontWeight: 600 }}
            >
              Hủy bỏ
            </Button>
            <Button
              color="red"
              variant="outline"
              leftSection={<IconTrash size={16} />}
              disabled={deleteConfirmText !== 'DELETE' || deleting}
              loading={deleting}
              onClick={handleDeleteAccount}
              radius="md"
              style={{ fontWeight: 600 }}
            >
              Xác nhận xóa vĩnh viễn
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
}

