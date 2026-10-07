export default function Loading() {
  return (
    <div className="container mx-auto min-h-[60vh] animate-pulse px-4 py-24">
      <div className="mx-auto h-10 w-2/3 rounded bg-muted" />
      <div className="mx-auto mt-6 h-4 w-1/2 rounded bg-muted" />
      <div className="mx-auto mt-4 h-4 w-1/3 rounded bg-muted" />
    </div>
  )
}
