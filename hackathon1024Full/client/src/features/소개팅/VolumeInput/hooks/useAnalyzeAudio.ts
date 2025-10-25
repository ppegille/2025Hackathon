import { useMutation } from '@tanstack/react-query'
import { analyzeAudio, type AnalyzeAudioResponse } from '../api/analyzeAudio'

interface UseAnalyzeAudioOptions {
  onSuccess?: (data: AnalyzeAudioResponse) => void
  onError?: (error: Error) => void
}

export const useAnalyzeAudio = (options?: UseAnalyzeAudioOptions) => {
  return useMutation({
    mutationFn: analyzeAudio,
    gcTime: 0,
    onSuccess: (data) => {
      console.log('분석 완료:', data)
      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      console.error('분석 실패:', error)
      options?.onError?.(error)
    },
  })
}
