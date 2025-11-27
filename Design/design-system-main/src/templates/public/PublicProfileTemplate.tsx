/**
 * Public Profile Template
 * Beauty Smile Design System
 *
 * Template for public user profile pages
 */

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn } from '@/utils/cn'

export interface PublicProfileData {
  name: string
  headline?: string
  bio?: string
  avatar?: string
  location?: string
  joinedDate?: string
  stats?: Array<{
    label: string
    value: string | number
  }>
}

export interface PublicProfileTemplateProps {
  /**
   * Profile data
   */
  profile: PublicProfileData
  /**
   * Additional profile sections
   */
  children?: React.ReactNode
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Public Profile Template
 *
 * Pre-built template for public user profile pages.
 *
 * @example
 * ```tsx
 * <PublicProfileTemplate
 *   profile={{
 *     name: 'João Silva',
 *     headline: 'Desenvolvedor Full Stack',
 *     bio: 'Apaixonado por tecnologia...',
 *     avatar: 'https://...',
 *     location: 'São Paulo, Brasil',
 *     joinedDate: 'Janeiro 2024',
 *     stats: [
 *       { label: 'Projetos', value: 12 },
 *       { label: 'Certificações', value: 5 },
 *     ]
 *   }}
 * >
 *   <div>Additional content...</div>
 * </PublicProfileTemplate>
 * ```
 */
export const PublicProfileTemplate: React.FC<PublicProfileTemplateProps> = ({
  profile,
  children,
  className,
}) => {
  return (
    <div className={cn('min-h-screen bg-neutral-50', className)}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-accent-100 flex items-center justify-center">
                    <span className="text-4xl font-bold text-accent-600">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-neutral-900 mb-2">
                  {profile.name}
                </h1>

                {profile.headline && (
                  <p className="text-lg text-neutral-600 mb-3">
                    {profile.headline}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm text-neutral-500 mb-4">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {profile.location}
                    </span>
                  )}

                  {profile.joinedDate && (
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Membro desde {profile.joinedDate}
                    </span>
                  )}
                </div>

                {profile.bio && (
                  <p className="text-neutral-700 whitespace-pre-wrap">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {profile.stats && profile.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {profile.stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-neutral-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-neutral-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Additional Content */}
        {children}
      </div>
    </div>
  )
}

PublicProfileTemplate.displayName = 'PublicProfileTemplate'
