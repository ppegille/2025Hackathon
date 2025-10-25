import { Button } from '@/shared/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_mainLayout/result')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  return (
    <>
      <div>welcome result</div>
      <Button size="lg" type="button" onClick={() => navigate({ to: '/main' })}>
        Client 클라이언트
      </Button>
    </>
  )
}
