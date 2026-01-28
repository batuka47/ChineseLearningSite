import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 bg-background">
      <h1 className="text-2xl font-semibold text-foreground">404 – Page not found</h1>
      <p className="text-muted-foreground text-center">
        The page you’re looking for doesn’t exist or the deployment may still be building.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-md bg-accent text-accent-foreground hover:opacity-90 transition-opacity font-medium"
      >
        Go home
      </Link>
    </div>
  )
}
