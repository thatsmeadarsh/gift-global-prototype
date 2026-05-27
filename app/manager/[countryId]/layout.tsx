import { COUNTRIES } from "@/lib/mock-data"
import ManagerShell from "./ManagerShell"

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ countryId: c.id }))
}

export default async function ManagerLayout({ children, params }: {
  children: React.ReactNode
  params: Promise<{ countryId: string }>
}) {
  const { countryId } = await params
  return <ManagerShell countryId={countryId}>{children}</ManagerShell>
}
