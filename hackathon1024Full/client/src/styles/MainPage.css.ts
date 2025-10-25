import { style, keyframes } from '@vanilla-extract/css';

// Keyframes 애니메이션
const float = keyframes({
  '0%, 100%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-10px)' }
});

// 스타일 정의
export const mainPage = style({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #ffeef8 0%, #fff5f8 100%)',
});

export const mainHeader = style({
  textAlign: 'center',
  padding: '32px 16px 24px',
  background: 'white',
  borderBottom: '1px solid #f0f0f0',
});

export const logo = style({
  fontSize: '32px',
  fontWeight: 800,
  color: '#ff6b9d',
  marginBottom: '8px',
});

export const subtitle = style({
  fontSize: '16px',
  color: '#666',
});

export const heroSection = style({
  padding: '32px 16px',
});

export const heroIllustration = style({
  display: 'flex',
  justifyContent: 'center',
  gap: '24px',
  marginBottom: '32px',
});

export const heartIcon = style({
  fontSize: '64px',
  animation: `${float} 3s ease-in-out infinite`,
});

export const micIcon = style({
  fontSize: '64px',
  animation: `${float} 3s ease-in-out infinite`,
  animationDelay: '0.5s',
});

export const features = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px',
  marginBottom: '32px',
});

export const featureCard = style({
  background: 'white',
  padding: '16px',
  borderRadius: '12px',
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
});

export const featureIcon = style({
  fontSize: '32px',
  display: 'block',
  marginBottom: '8px',
});

export const featureCardTitle = style({
  fontSize: '14px',
  fontWeight: 700,
  color: '#333',
  marginBottom: '4px',
});

export const featureCardDescription = style({
  fontSize: '12px',
  color: '#666',
  lineHeight: 1.4,
});

export const profileSection = style({
  padding: '0 16px 32px',
});

export const sectionTitle = style({
  fontSize: '20px',
  fontWeight: 700,
  color: '#333',
  marginBottom: '20px',
  textAlign: 'center',
});

export const profileGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const profileCard = style({
  background: 'white',
  borderRadius: '16px',
  padding: '20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  ':hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(255, 107, 157, 0.2)',
  },
});

export const profileImageContainer = style({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '16px',
  position: 'relative',
});

export const profileImage = style({
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  objectFit: 'cover',
  objectPosition: 'center',
  border: '3px solid #ff6b9d',
  boxShadow: '0 4px 12px rgba(255, 107, 157, 0.3)',
  transition: 'all 0.3s ease',
  ':hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 16px rgba(255, 107, 157, 0.4)',
  },
});

export const profileImagePlaceholder = style({
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #ff6b9d 0%, #ffa8c5 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '48px',
  fontWeight: 700,
  color: 'white',
  border: '3px solid #ff6b9d',
  boxShadow: '0 4px 12px rgba(255, 107, 157, 0.3)',
});

export const profileInfo = style({
  textAlign: 'center',
  marginBottom: '16px',
});

export const profileName = style({
  fontSize: '22px',
  fontWeight: 700,
  color: '#333',
  marginBottom: '4px',
});

export const profileAge = style({
  fontSize: '16px',
  fontWeight: 400,
  color: '#666',
});

export const profilePersonality = style({
  fontSize: '14px',
  color: '#ff6b9d',
  fontWeight: 600,
  marginBottom: '8px',
});

export const profileDescription = style({
  fontSize: '14px',
  color: '#666',
  lineHeight: 1.5,
  marginBottom: '12px',
});

export const profileInterests = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  justifyContent: 'center',
  marginBottom: '16px',
});

export const interestTag = style({
  background: '#fff0f6',
  color: '#ff6b9d',
  padding: '6px 12px',
  borderRadius: '16px',
  fontSize: '12px',
  fontWeight: 500,
});

export const startChatButton = style({
  width: '100%',
  padding: '16px',
  background: 'linear-gradient(135deg, #ff6b9d 0%, #ff8fb3 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'transform 0.2s, box-shadow 0.2s',
  ':hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 12px rgba(255, 107, 157, 0.3)',
  },
  ':active': {
    transform: 'scale(0.98)',
  },
});

export const mainFooter = style({
  textAlign: 'center',
  padding: '24px',
  color: '#999',
  fontSize: '12px',
});

export const retryButton = style({
  display: 'block',
  margin: '16px auto',
  padding: '12px 24px',
  background: '#ff6b9d',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
});

// Loading & Error 스타일
export const loading = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '200px',
});

export const spinner = style({
  border: '3px solid #f3f3f3',
  borderTop: '3px solid #ff6b9d',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
});

export const errorMessage = style({
  background: '#fee',
  color: '#c33',
  padding: '12px 16px',
  borderRadius: '8px',
  margin: '16px',
  textAlign: 'center',
});

// 미디어 쿼리
export const featuresResponsive = style({
  '@media': {
    '(min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
  },
});
