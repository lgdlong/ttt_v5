import { Button, Container, Group, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router';
import { Illustration } from './Illustration';
import { VI } from '@/lib/constants';
import classes from './not-found.module.css';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container className={classes.root} size="md">
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>{VI.notFoundTitle}</Title>
          <Text c="dimmed" size="lg" className={classes.description}>
            {VI.notFoundDescription}
          </Text>
          <Group justify="center">
            <Button size="lg" variant="filled" color="orange" onClick={() => navigate('/')}>
              {VI.backToHome}
            </Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}
