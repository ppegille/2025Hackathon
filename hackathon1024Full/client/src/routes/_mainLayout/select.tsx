import { Button } from '@/shared/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_mainLayout/select')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  return (
    <>
      <div>welcome select</div>
      <Button
        size="lg"
        type="button"
        onClick={() => navigate({ to: '/소개팅' })}
      >
        Client 클라이언트
      </Button>
    </>
  )
}
