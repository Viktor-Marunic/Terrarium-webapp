// The two stacked buttons under the login/sign-up forms: the submit button (dark, with an arrow) and
// "Continue as a guest". Guest access doesn't exist yet (every page needs an account), so that one is disabled.
import { ArrowRightIcon } from '@phosphor-icons/react'

export function AuthButtons({ label, pendingLabel, isPending }) {
  return (
    <div className="space-y-3 pt-1">
      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-forest-700 py-3.5 font-medium text-white transition-[background-color,scale] hover:bg-forest-800 disabled:opacity-60 motion-safe:active:scale-[0.98]"
      >
        {isPending ? pendingLabel : label}
        {!isPending && <ArrowRightIcon size={18} aria-hidden="true" />}
      </button>
      <button
        type="button"
        disabled
        title="Guest access is coming soon"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-stone-300 bg-paper py-3.5 font-medium text-forest-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Continue as a guest
        <ArrowRightIcon size={18} aria-hidden="true" />
      </button>
    </div>
  )
}
