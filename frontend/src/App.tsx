import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import { VideoBrowserPage } from "@/pages/public/video-browser"
import { AdminDashboardPage } from "@/pages/admin/dashboard"
import { VideoManagementPage } from "@/pages/admin/video-management"
import { TagManagementPage } from "@/pages/admin/tag-management"
import { PublicLayout } from "@/components/layout/public-layout"
import { AdminLayout } from "@/components/layout/admin-layout"
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicLayout><VideoBrowserPage /></PublicLayout>} />
          <Route path="/admin" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
          <Route path="/admin/videos" element={<AdminLayout><VideoManagementPage /></AdminLayout>} />
          <Route path="/admin/tags" element={<AdminLayout><TagManagementPage /></AdminLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App