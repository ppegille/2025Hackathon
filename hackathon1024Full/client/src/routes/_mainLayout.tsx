import { LeftSidebar } from '@/features/Sidebar/components/LeftSidebar'
import { RightSidebar } from '@/features/Sidebar/components/rightSidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_mainLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <LeftSidebar />
      <main style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
      <RightSidebar />
    </div>
  )
}
