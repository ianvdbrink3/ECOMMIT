import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">TVB</span>
          </div>
          <div>
            <p className="text-[#f5f5f5] font-bold text-lg">TVB Allocator</p>
            <p className="text-[#737373] text-xs">Truin vdBrink Test Budget Allocator</p>
          </div>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-[#111111] border border-[#262626] shadow-xl',
              headerTitle: 'text-[#f5f5f5]',
              headerSubtitle: 'text-[#737373]',
              formFieldLabel: 'text-[#a3a3a3]',
              formFieldInput:
                'bg-[#0a0a0a] border-[#262626] text-[#f5f5f5] focus:border-blue-500',
              formButtonPrimary:
                'bg-blue-600 hover:bg-blue-700 text-white',
              footerActionLink: 'text-blue-400 hover:text-blue-300',
              dividerLine: 'bg-[#262626]',
              dividerText: 'text-[#525252]',
              socialButtonsBlockButton:
                'border-[#262626] bg-[#111111] text-[#f5f5f5] hover:bg-[#1f1f1f]',
              socialButtonsBlockButtonText: 'text-[#f5f5f5]',
            },
          }}
        />
      </div>
    </div>
  )
}
