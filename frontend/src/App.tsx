import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { VideoBrowserPage } from "@/pages/public/video-browser"
import { AdminDashboardPage } from "@/pages/admin/dashboard"
import { VideoManagementPage } from "@/pages/admin/video-management"
import { TagManagementPage } from "@/pages/admin/tag-management"
import { PublicLayout } from "@/components/layout/public-layout"
import { AdminAuth } from "@/components/layout/admin-auth"
import { LoginPage } from "@/pages/public/login"
import { RegisterPage } from "@/pages/public/register"

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

const theme = createTheme({
  fontFamily: 'Be Vietnam Pro, sans-serif',
  headings: {
    fontFamily: 'Merriweather, serif',
  },
  colors: {
    earth: [
      '#F6F4F0',
      '#ECE7DF',
      '#DCD4C6',
      '#CBBFAC',
      '#BAA991',
      '#A38F72',
      '#917F65',
      '#7F6E58',
      '#6C5E4B',
      '#5A4E3E',
    ],
    monochrome: [
      '#F8F9FA',
      '#F1F3F5',
      '#E9ECEF',
      '#DEE2E6',
      '#CED4DA',
      '#ADB5BD',
      '#868E96',
      '#495057',
      '#343A40',
      '#212529',
    ],
    midnight: [
      '#FBF6E9',
      '#F4EAD1',
      '#E6D1A3',
      '#D8B775',
      '#CA9E47',
      '#D4AF37',
      '#A6882B',
      '#78621F',
      '#4A3C13',
      '#1C1707',
    ],
    crimson: [
      '#FFF5F5',
      '#FFE3E3',
      '#FFC9C9',
      '#FFA8A8',
      '#FF8787',
      '#FF6B6B',
      '#FA5252',
      '#F03E3E',
      '#E03131',
      '#C92A2A',
    ],
    steel: [
      '#F8FAFC',
      '#F1F5F9',
      '#E2E8F0',
      '#CBD5E1',
      '#94A3B8',
      '#64748B',
      '#475569',
      '#334155',
      '#1E293B',
      '#0F172A',
    ],
    dark: [
      '#E5E5E1', // index 0: Text (Stone Off-white)
      '#D4D4D0',
      '#A3A39F',
      '#73736E', // index 3: Muted Text
      '#52524E',
      '#40403C',
      '#262624', // index 6: Surface (Stone Dark)
      '#1C1C1A', // index 7: Background (Stone Black)
      '#171715',
      '#0F0F0E',
    ],
  },
  primaryColor: 'earth',
  defaultRadius: 'md',
  components: {
    Badge: {
      styles: {
        root: {
          border: '1px solid var(--mantine-color-default-border)',
          fontWeight: 500,
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout><VideoBrowserPage /></PublicLayout>} />
          <Route path="/admin" element={<AdminAuth><AdminDashboardPage /></AdminAuth>} />
          <Route path="/admin/videos" element={<AdminAuth><VideoManagementPage /></AdminAuth>} />
          <Route path="/admin/tags" element={<AdminAuth><TagManagementPage /></AdminAuth>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App