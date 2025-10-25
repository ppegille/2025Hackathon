import { vars } from '@/vars.css'
import { style } from '@vanilla-extract/css'

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: vars.spacing.sm,
  position: 'absolute',
  zIndex: 5,
  right: '5%',
  bottom: '30%',
  backgroundColor: vars.colors.mainXLightOP,
  opacity: 0.9,
  padding: vars.spacing.md,
  borderRadius: '38px',
  boxShadow: `0 4px 12px rgba(0, 0, 0, 0.1)`,
})

export const meterWrapper = style({
  position: 'relative',
  width: '40px',
  height: '200px',
  backgroundColor: vars.colors.sub,
  borderRadius: '38px',
  overflow: 'hidden',
  border: `2px solid ${vars.colors.border}`,
})

export const meterFill = style({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  transition: 'height 0.1s ease-out, background-color 0.2s ease',
  borderRadius: `0 0 ${vars.radius.md} ${vars.radius.md}`,
})

export const peakIndicator = style({
  position: 'absolute',
  left: 0,
  right: 0,
  height: '3px',
  backgroundColor: vars.colors.mainDark,
  transition: 'top 0.1s ease-out, opacity 0.3s ease',
  boxShadow: `0 0 4px ${vars.colors.mainDark}`,
})

export const label = style({
  fontSize: vars.font.size.sm,
  fontWeight: vars.font.weight.medium,
  color: vars.colors.subText,
  textAlign: 'center',
})

export const valueLabel = style({
  fontSize: vars.font.size.xs,
  fontWeight: vars.font.weight.normal,
  color: vars.colors.subDark,
})
