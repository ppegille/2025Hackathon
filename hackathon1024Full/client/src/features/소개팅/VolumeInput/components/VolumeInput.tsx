import { useEffect, useRef, useState } from 'react'
import { vars } from '@/vars.css'

interface VolumeInputProps {
  /** 녹음 완료 시 콜백 */
  onSubmit?: (audioBlob: Blob) => void
  /** 볼륨 변화 콜백 */
  onVolumeChange?: (level: number) => void
  setVolumeLevel: (level: number) => void
  isDone: boolean
  setIsDone: (prev:boolean) => void
}

const silenceThreshold = 50
const speechStartThreshold = 50
const silenceDuration = 2000

export function VolumeInput({
  onSubmit,
  onVolumeChange,
  setVolumeLevel,
  isDone,
  setIsDone
}: VolumeInputProps) {
  const [message, setMessage] = useState('시작 대기중...')

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const silenceTimerRef = useRef<number | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const isRecordingRef = useRef(false)
  const hasSpeechStartedRef = useRef(false)

  // 오디오 볼륨 분석
  const analyzeVolume = () => {
    if (!analyserRef.current || !isRecordingRef.current) {
      return
    }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    // RMS (Root Mean Square) 계산
    const sum = dataArray.reduce((acc, val) => acc + val * val, 0)
    const rms = Math.sqrt(sum / dataArray.length)
    const level = Math.min(100, (rms / 128) * 100) // 0-100으로 정규화

    setVolumeLevel(level)
    onVolumeChange?.(level)

    // 디버깅: 볼륨 레벨을 주기적으로 출력 (매 50프레임마다)
    if (Math.random() < 0.02) {
      console.log(`볼륨 레벨: ${level.toFixed(1)}, 음성 시작됨: ${hasSpeechStartedRef.current}, 침묵 타이머: ${silenceTimerRef.current ? 'ON' : 'OFF'}`)
    }

    if (!hasSpeechStartedRef.current) {
      if (level >= speechStartThreshold) {
        hasSpeechStartedRef.current = true
        setMessage('녹음 중... (침묵하면 자동 종료)')
        console.log('✅ 음성 감지! 침묵 감지 시작')
      }
    } else {
      if (level < silenceThreshold) {
        // 침묵 시작
        if (!silenceTimerRef.current) {
          console.log(`⏱️ 침묵 시작 (레벨: ${level.toFixed(1)}) - ${silenceDuration}ms 타이머 시작`)
          silenceTimerRef.current = window.setTimeout(() => {
            console.log('🛑 침묵으로 인한 녹음 종료')
            stopRecording()
          }, silenceDuration)
        }
      } else {
        // 소리 감지 - 침묵 타이머 리셋
        if (silenceTimerRef.current) {
          console.log(`🔊 소리 감지 (레벨: ${level.toFixed(1)}) - 침묵 타이머 리셋`)
          clearTimeout(silenceTimerRef.current)
          silenceTimerRef.current = null
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(analyzeVolume)
  }

  // 녹음 시작
  const startRecording = async () => {
    try {
      setIsDone(false)
      setMessage('마이크 접근 중...')

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })

      // 이전 AudioContext가 있다면 완전히 종료될 때까지 대기
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        console.log('⏳ 이전 AudioContext 종료 대기 중...')
        await audioContextRef.current.close()
        audioContextRef.current = null
      }

      // AudioContext 설정 (완전히 새로 생성)
      console.log('🎧 새로운 AudioContext 생성')
      audioContextRef.current = new AudioContext()
      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      analyserRef.current.smoothingTimeConstant = 0.8
      sourceRef.current.connect(analyserRef.current)

      // 이전 MediaRecorder 명시적으로 정리
      if (mediaRecorderRef.current) {
        console.log('🧹 이전 MediaRecorder 정리')
        mediaRecorderRef.current.ondataavailable = null
        mediaRecorderRef.current.onstop = null
        mediaRecorderRef.current = null
      }

      // MediaRecorder 설정 - Opus 코덱 명시
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4'

      console.log(`🎤 MediaRecorder 생성: ${mimeType}`)
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000, // 명시적으로 비트레이트 설정
      })

      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log(`데이터 청크 수신: ${event.data.size} bytes`)
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        console.log('📦 onstop 이벤트 발생 - Blob 생성 시작')
        // 모든 데이터가 수집될 때까지 충분히 대기
        setTimeout(() => {
          console.log(`총 청크 개수: ${audioChunksRef.current.length}`)
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
          console.log(`녹음 완료: ${audioBlob.size} bytes, type: ${mimeType}`)

          // 최소 크기 검증 (5KB 이상 - WebM 헤더를 포함한 최소 크기)
          if (audioBlob.size > 5000) {
            onSubmit?.(audioBlob)
            setMessage('분석 중... 잠시만 기다려주세요')
          } else {
            console.warn(`녹음 파일이 너무 작습니다: ${audioBlob.size} bytes`)
            setMessage('음성이 너무 짧습니다 - 다시 시도해주세요')
            // 자동 재시작 (리소스 정리 시간 충분히 확보)
            setTimeout(() => startRecording(), 2000)
          }

          // Blob 생성 후 이벤트 핸들러 정리
          if (mediaRecorderRef.current) {
            mediaRecorderRef.current.ondataavailable = null
            mediaRecorderRef.current.onstop = null
            console.log('📤 Blob 전송 완료 - 이벤트 핸들러 제거')
          }
        }, 300)
      }

      // timeslice를 더 크게 설정하여 안정성 향상
      mediaRecorderRef.current.start(500) // 500ms마다 데이터 수집

      isRecordingRef.current = true
      hasSpeechStartedRef.current = false
      setMessage('말씀해주세요... (음성을 기다리는 중)')

      analyzeVolume()
    } catch (error) {
      console.error('마이크 접근 실패:', error)
      setMessage('마이크 권한이 필요합니다')
    }
  }

  // 녹음 중지
  const stopRecording = () => {
    setMessage('처리 중...')

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    isRecordingRef.current = false
    hasSpeechStartedRef.current = false

    // 타이머 정리
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    // MediaRecorder 중지
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      // 버퍼에 남은 데이터를 모두 수집
      if (mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.requestData()
      }

      mediaRecorderRef.current.stop()
      console.log('🛑 MediaRecorder.stop() 호출 - onstop 이벤트 대기 중')

      // 스트림 트랙 정리
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => {
          track.stop()
          console.log(`트랙 정리: ${track.kind}`)
        })
    }

    // 주의: 이벤트 핸들러는 onstop 콜백에서 제거됨!
    // MediaRecorder 인스턴스는 명시적으로 null 처리하여 다음 녹음 시 완전히 새로 생성되도록 보장
    // (startRecording에서 추가 정리 수행)

    if (sourceRef.current) {
      sourceRef.current.disconnect()
      sourceRef.current = null
    }

    // AudioContext 종료 (비동기로 종료만 시작, startRecording에서 완전 종료 대기)
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch((err) => {
        console.warn('AudioContext 종료 중 경고:', err)
      })
      // 주의: 여기서는 null 처리 안함 (startRecording에서 완전 종료 확인 후 null 처리)
    }

    // 분석기 정리
    analyserRef.current = null

    setVolumeLevel(0)
    console.log('🧹 녹음 리소스 완전 정리 완료')
  }

  // 컴포넌트 마운트 시 자동 시작
  useEffect(() => {
    startRecording()

    return () => {
      stopRecording()
    }
  }, [])

  // isDone이 true가 되면 자동으로 녹음 재시작
  useEffect(() => {
    console.log(isDone)
    if (isDone) {
      console.log('💬 대답 완료 - 녹음 재시작 준비')
      // 이전 녹음 세션 완전히 정리
      stopRecording()
      // 충분한 대기 시간 후 재시작 (브라우저가 리소스 완전히 해제할 시간 확보)
      const restartTimer = setTimeout(() => {
        console.log('🎤 녹음 재시작 실행')
        startRecording()
      }, 2000)

      return () => clearTimeout(restartTimer)
    }
  }, [isDone])

  return (
    <div
      style={{
        position: 'absolute',
        left: '20px',
        top: '10px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: vars.spacing.md,
        padding: vars.spacing.md,
        backgroundColor: vars.colors.mainXLight,
        borderRadius: vars.radius.lg,
        border: `2px solid ${vars.colors.mainBorder}`,
      }}
    >
      <div
        style={{
          fontSize: '20px',
          fontWeight: vars.font.weight.medium,
          color: vars.colors.label,
        }}
      >
        {message}
      </div>
      {isRecordingRef.current && (
        <button
          onClick={() => {
            console.log('수동 녹음 종료 버튼 클릭')
            stopRecording()
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: vars.colors.main,
            color: 'white',
            border: 'none',
            borderRadius: vars.radius.md,
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: vars.font.weight.medium,
          }}
        >
          녹음 종료
        </button>
      )}
    </div>
  )
}
