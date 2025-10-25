import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import * as styles from '@/styles/MainPage.css'

export const Route = createFileRoute('/_mainLayout/main')({
  component: RouteComponent,
})

const profilesData = [
  {
    id: 'jiwoo',
    name: '지우',
    age: 25,
    personality: '밝고 활발한',
    description: '에너지 넘치고 긍정적인 성격으로 대화를 즐겁게 이끌어요',
    interests: ['카페 투어', '영화 감상', '여행', '요리'],
  },
  {
    id: 'seojun',
    name: '서준',
    age: 27,
    personality: '진중하고 사려 깊은',
    description: '깊이 있는 대화를 좋아하는 지적인 매력을 가진 분',
    interests: ['독서', '미술 전시', '철학적 대화', '클래식 음악'],
  },
  {
    id: 'minseo',
    name: '민서',
    age: 26,
    personality: '유머러스하고 편안한',
    description: '재치있는 농담으로 분위기를 부드럽게 만들어요',
    interests: ['코미디 쇼', '스포츠', '게임', '맛집 탐방'],
  },
]

function RouteComponent() {
  const navigate = useNavigate()
  const [profiles] = useState(profilesData)

  const getProfileImage = (profileId: string) => {
    return `/profiles/${profileId}.png`
  }

  const handleStartChat = () => {
    navigate({ to: `/소개팅` })
  }

  return (
    <div className={styles.mainPage}>
      <div className={styles.mainHeader}>
        <h1 className={styles.logo}>💕 AI Voice Date</h1>
        <p className={styles.subtitle}>AI와 함께하는 소개팅 연습</p>
      </div>

      <div className={styles.heroSection}>
        <div className={styles.heroIllustration}>
          <div className={styles.heartIcon}>💕</div>
          <div className={styles.micIcon}>🎤</div>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🎤</span>
            <h3 className={styles.featureCardTitle}>실제 음성</h3>
            <p className={styles.featureCardDescription}>
              마이크로 자연스러운 대화
            </p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🤖</span>
            <h3 className={styles.featureCardTitle}>AI 응답</h3>
            <p className={styles.featureCardDescription}>실시간 음성 대화</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>📊</span>
            <h3 className={styles.featureCardTitle}>피드백</h3>
            <p className={styles.featureCardDescription}>대화 분석 결과</p>
          </div>
        </div>
      </div>

      <div className={styles.profileSection}>
        <h2 className={styles.sectionTitle}>AI 프로필을 선택하세요</h2>
        <div className={styles.profileGrid}>
          {profiles.map((profile) => (
            <div key={profile.id} className={styles.profileCard}>
              <div className={styles.profileImageContainer}>
                <img
                  src={getProfileImage(profile.id)}
                  alt={profile.name}
                  className={styles.profileImage}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const placeholder = target.nextSibling as HTMLElement
                    if (placeholder) {
                      placeholder.style.display = 'flex'
                    }
                  }}
                />
                <div
                  className={styles.profileImagePlaceholder}
                  style={{ display: 'none' }}
                >
                  👤
                </div>
              </div>

              <div className={styles.profileInfo}>
                <h3 className={styles.profileName}>{profile.name}</h3>
                <p className={styles.profileAge}>{profile.age}세</p>
                <p className={styles.profilePersonality}>
                  {profile.personality}
                </p>
                <p className={styles.profileDescription}>
                  {profile.description}
                </p>
              </div>

              <div className={styles.profileInterests}>
                {profile.interests.map((interest, index) => (
                  <span key={index} className={styles.interestTag}>
                    {interest}
                  </span>
                ))}
              </div>

              <button
                className={styles.startChatButton}
                onClick={() => handleStartChat()}
              >
                {profile.name}와 대화하기
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.mainFooter}>
        <p>AI Voice Date - 소개팅 연습을 도와드립니다</p>
      </div>
    </div>
  )
}
