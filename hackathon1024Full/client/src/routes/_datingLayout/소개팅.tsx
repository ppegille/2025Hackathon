import { VolumeInput } from '@/features/소개팅/VolumeInput/components/VolumeInput'
import { useAnalyzeAudio } from '@/features/소개팅/VolumeInput/hooks/useAnalyzeAudio'
import VolumeMeter from '@/features/소개팅/VolumeMeter/components/VolumeMeter'
import { Button } from '@/shared/components'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/_datingLayout/소개팅')({
  component: RouteComponent,
})

export type responseDataType = {
  isFeedback: boolean
  audio: Blob
}

function RouteComponent() {
  const navigate = useNavigate()
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [responseData, setResponseData] = useState<responseDataType>()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isDone, setIsDone] = useState(false)

  const { mutate: analyzeAudio, isPending } = useAnalyzeAudio({
    onSuccess: (data) => {
      console.log('분석 완료', data.audio)

      const byteCharacters = atob(data.audio)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)

      setResponseData({
        isFeedback: true,
        audio: new Blob([byteArray], { type: 'audio/webm' }),
      })
    },
    onError: (error) => {
      alert(`분석 실패: ${error.message}`)
    },
  })

  useEffect(() => {
    if (!isPending && responseData?.audio) {
      const audioUrl = URL.createObjectURL(responseData.audio)
      console.log('재생할 오디오 URL 설정')
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.play()
      }

      return () => {
        URL.revokeObjectURL(audioUrl)
      }
    }
  }, [isPending, responseData])

  const handleAudioEnded = () => {
    console.log('오디오 재생 완료!')
    setIsDone(true)
  }

  const submitCallback = (audioBlob: Blob) => {
    console.log('녹음 완료:', audioBlob)

    analyzeAudio({ audioBlob })
  }

  const volumeChangeCallback = (level: number) => {
    console.log('볼륨 변화:', level)
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <audio
        ref={audioRef}
        style={{ display: 'none' }}
        onEnded={handleAudioEnded}
      />

      <VolumeInput
        setVolumeLevel={setVolumeLevel}
        onSubmit={submitCallback}
        onVolumeChange={volumeChangeCallback}
        isDone={isDone}
        setIsDone={setIsDone}
      />
      <Button
        size="lg"
        type="button"
        onClick={() => navigate({ to: '/result' })}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          zIndex: 10,
          opacity: 0.8,
          borderRadius: '90px',
        }}
        variant="sub"
      >
        정민지 📞✖️
      </Button>
      <VolumeMeter
        level={volumeLevel}
        height={250}
        width={50}
        label="마이크"
        showValue={true}
      />
      <video
        autoPlay
        muted
        playsInline
        loop
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src="/video/normal.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
