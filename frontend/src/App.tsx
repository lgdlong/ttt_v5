import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { VideoBrowserPage } from "@/pages/public/video-browser"
import { AdminDashboardPage } from "@/pages/admin/dashboard"
import { VideoManagementPage } from "@/pages/admin/video-management"
import { TagManagementPage } from "@/pages/admin/tag-management"
import { PublicLayout } from "@/components/layout/public-layout"
import { AdminAuth } from "@/components/layout/admin-auth"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout><VideoBrowserPage /></PublicLayout>} />
          <Route path="/admin" element={<AdminAuth><AdminDashboardPage /></AdminAuth>} />
          <Route path="/admin/videos" element={<AdminAuth><VideoManagementPage /></AdminAuth>} />
          <Route path="/admin/tags" element={<AdminAuth><TagManagementPage /></AdminAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App