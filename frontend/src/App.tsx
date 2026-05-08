import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { VideoBrowserPage } from "@/pages/public/video-browser"
import { AdminDashboardPage } from "@/pages/admin/dashboard"
import { VideoManagementPage } from "@/pages/admin/video-management"
import { TagManagementPage } from "@/pages/admin/tag-management"
import { PublicLayout } from "@/components/layout/public-layout"
import { AdminAuth } from "@/components/layout/admin-auth"

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
  },
  primaryColor: 'earth',
  defaultRadius: 'md',
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App