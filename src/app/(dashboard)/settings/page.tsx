import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UserProfile } from '@clerk/nextjs'

export default function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-[#f5f5f5]">Account Settings</h2>
        <p className="text-sm text-[#737373]">Manage your profile and account preferences</p>
      </div>

      <UserProfile
        appearance={{
          elements: {
            rootBox: 'w-full',
            card: 'bg-[#111111] border border-[#262626] shadow-none',
            headerTitle: 'text-[#f5f5f5]',
            headerSubtitle: 'text-[#737373]',
            profileSectionTitleText: 'text-[#a3a3a3]',
            formFieldLabel: 'text-[#a3a3a3]',
            formFieldInput: 'bg-[#0a0a0a] border-[#262626] text-[#f5f5f5]',
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
            navbarButton: 'text-[#a3a3a3] hover:text-[#f5f5f5]',
            navbarButtonActive: 'text-blue-400',
            badge: 'bg-blue-600',
            accordionTriggerButton: 'text-[#a3a3a3] hover:text-[#f5f5f5]',
          },
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">About TVB Allocator</CardTitle>
          <CardDescription>Application information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#737373]">Version</span>
            <span className="text-[#f5f5f5]">1.0.0</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#737373]">Stack</span>
            <span className="text-[#f5f5f5]">Next.js 15 · React 19 · TypeScript</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#737373]">Auth</span>
            <span className="text-[#f5f5f5]">Clerk</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#737373]">Database</span>
            <span className="text-[#f5f5f5]">PostgreSQL + Prisma</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
