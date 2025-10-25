export interface AnalyzeAudioRequest {
  audioBlob: Blob
}

export interface AnalyzeAudioResponse {
  recognized_text: string  // 사용자가 말한 내용 (STT 결과)
  audio: string            // AI 응답 음성 (Base64)
}

export const analyzeAudio = async (
  request: AnalyzeAudioRequest,
): Promise<AnalyzeAudioResponse> => {
  const formData = new FormData()

  const audioFile = new File(
    [request.audioBlob],
    `recording_${Date.now()}.webm`,
    { type: request.audioBlob.type },
  )

  formData.append('file', audioFile)

  const response = await fetch('http://localhost:8000/voice-chat', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`)
  }

  return response.json()
}
