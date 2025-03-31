import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { Button } from '@/components/ui/button'
import SignInForm from './signin-form'
import SeparatorWithOr from '@/components/shared/seprator-or'
import { GoogleSignInForm } from './google-signin-form'

export const metadata: Metadata = {
  title: 'Sign In',
}

export default async function SignIn(props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {
  const searchParams = await props.searchParams

  const { callbackUrl = '/' } = searchParams

  const session = await auth()
  if (session) {
    return redirect(callbackUrl)
  }

  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <SignInForm />
          </div>
          <SeparatorWithOr/>
          <div className='mt-5'>
            <GoogleSignInForm/>
          </div>
        </CardContent>
      </Card>
      <SeparatorWithOr>New ?</SeparatorWithOr>

      <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
        <Button className='w-full' variant='outline'>
          Create Account
        </Button>
      </Link>
    </div>
  )
}