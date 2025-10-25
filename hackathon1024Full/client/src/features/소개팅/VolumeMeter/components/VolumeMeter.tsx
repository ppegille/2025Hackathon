import * as styles from './VolumeMeter.css'
import { vars } from '@/vars.css'

interface VolumeMeterProps {
  /** 볼륨 레벨 (0-100) */
  level: number
  /** 미터 높이 (기본: 200px) */
  height?: number
  /** 미터 너비 (기본: 40px) */
  width?: number
  /** 라벨 텍스트 */
  label?: string
  /** 현재 값 표시 여부 */
  showValue?: boolean
}

const VolumeMeter = ({
  level,
  height = 200,
  width = 40,
  label,
  showValue = false,
}: VolumeMeterProps) => {
  // 레벨 범위 제한
  const clampedLevel = Math.max(0, Math.min(100, level))

  // 레벨에 따른 색상 결정
  const getFillColor = (vol: number): string => {
    if (vol >= 85) return vars.colors.error // 빨강
    if (vol >= 70) return vars.colors.warning // 노랑
    if (vol >= 50) return vars.colors.mainDark // 진한 핑크
    return vars.colors.main // 기본 핑크
  }

  const fillHeight = (clampedLevel / 100) * height

  return (
    <div className={styles.container}>
      {label && <div className={styles.label}>{label}</div>}

      <div
        className={styles.meterWrapper}
        style={{
          width: `${width}px`,
          height: `${height}px`,
        }}
      >
        {/* 볼륨 게이지 */}
        <div
          className={styles.meterFill}
          style={{
            height: `${fillHeight}px`,
            backgroundColor: getFillColor(clampedLevel),
          }}
        />
      </div>

      {showValue && (
        <div className={styles.valueLabel}>{Math.round(clampedLevel)}%</div>
      )}
    </div>
  )
}

export default VolumeMeter
