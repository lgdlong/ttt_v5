import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Stack,
  LoadingOverlay,
  Divider,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { signIn, signUp } from '@/lib/auth-client';
import { notifications } from '@mantine/notifications';
import { IconBrandGoogle } from '@tabler/icons-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

export function AuthForm({ type }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      rememberMe: true,
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Email không hợp lệ'),
      password: (val) => (val.length < 6 ? 'Mật khẩu phải có ít nhất 6 ký tự' : null),
      name: (val) => (type === 'register' && val.length < 2 ? 'Tên quá ngắn' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      if (type === 'login') {
        const { data, error } = await signIn.email({
          email: values.email,
          password: values.password,
          rememberMe: values.rememberMe,
        });

        if (error) {
          notifications.show({
            title: 'Lỗi đăng nhập',
            message: error.message || 'Email hoặc mật khẩu không chính xác',
            color: 'red',
          });
        } else {
          notifications.show({
            title: 'Thành công',
            message: 'Chào mừng bạn quay trở lại!',
            color: 'green',
          });
          // Redirect admin to /admin, regular users to home
          const role = (data?.user as { role?: string } | undefined)?.role;
          navigate(role === 'admin' ? '/admin' : '/');
        }
      } else {
        const { error } = await signUp.email({
          email: values.email,
          password: values.password,
          name: values.name,
          callbackURL: '/',
        });

        if (error) {
          notifications.show({
            title: 'Lỗi đăng ký',
            message: error.message || 'Không thể tạo tài khoản',
            color: 'red',
          });
        } else {
          notifications.show({
            title: 'Thành công',
            message: 'Tài khoản của bạn đã được tạo!',
            color: 'green',
          });
          navigate('/');
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      notifications.show({
        title: 'Lỗi hệ thống',
        message: error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" order={2} fw={900}>
        {type === 'login' ? 'Chào mừng quay trở lại!' : 'Tạo tài khoản mới'}
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        {type === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
        <Anchor
          component={Link}
          to={type === 'login' ? '/register' : '/login'}
          size="sm"
          fw={700}
        >
          {type === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md" pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />
        
        <Group grow mb="md" mt="md">
          <Button 
            leftSection={<IconBrandGoogle size={20} />} 
            variant="default" 
            radius="xl"
            onClick={() => {
              notifications.show({
                title: 'Thông báo',
                message: 'Tính năng đăng nhập Google đang được phát triển',
                color: 'blue',
              });
            }}
          >
            Google
          </Button>
        </Group>

        <Divider label="Hoặc tiếp tục với email" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            {type === 'register' && (
              <TextInput
                label="Họ và tên"
                placeholder="Nguyễn Văn A"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                error={form.errors.name}
                radius="md"
                required
              />
            )}

            <TextInput
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
              error={form.errors.email}
              radius="md"
              required
            />

            <PasswordInput
              label="Mật khẩu"
              placeholder="Mật khẩu của bạn"
              value={form.values.password}
              onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
              error={form.errors.password}
              radius="md"
              required
            />

            <Group justify="space-between">
              <Checkbox
                label="Ghi nhớ đăng nhập"
                checked={form.values.rememberMe}
                onChange={(event) => form.setFieldValue('rememberMe', event.currentTarget.checked)}
              />
              {type === 'login' && (
                <Anchor component={Link} to="/forgot-password" size="sm">
                  Quên mật khẩu?
                </Anchor>
              )}
            </Group>

            {type === 'register' && (
              <Checkbox
                label="Tôi đồng ý với các điều khoản dịch vụ"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                required
              />
            )}
          </Stack>

          <Button type="submit" radius="xl" fullWidth mt="xl">
            {type === 'login' ? 'Đăng nhập' : 'Đăng ký'}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
