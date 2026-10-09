'use server'

import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

/** Leave Sanity preview mode. Invoked from the <DisableDraftMode /> button. */
export async function disableDraftMode() {
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}
