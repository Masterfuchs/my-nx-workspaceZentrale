import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Authentifizierungsfehler</h2>
        <p className="text-muted-foreground mb-6">
          Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/auth/login">Zurück zur Anmeldung</Link>
          </Button>
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-slate-900">
            <Link href="/auth/register">Neues Konto erstellen</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
