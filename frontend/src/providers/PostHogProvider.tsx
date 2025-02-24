// app/providers.js
'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import PostHogPageView from "./PostHogPageView"
import config from '@/config'


export function PostHogProvider({ children }) {
  useEffect(() => {
    posthog.init(config.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: config.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false // Disable automatic pageview capture, as we capture manually
    })
  }, [])

  return (
    <PHProvider client={posthog}>
+       <PostHogPageView />
      {children}
    </PHProvider>
  )
}