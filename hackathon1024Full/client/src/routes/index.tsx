import { Button } from '@/shared/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const navigate = useNavigate()

  return (
    <Button size="lg" type="button" onClick={() => navigate({ to: '/main' })}>
      Client 클라이언트
    </Button>
  )
}
