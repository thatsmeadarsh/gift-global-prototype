import { COUNTRIES } from "@/lib/mock-data"
import ShopShell from "./ShopShell"

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ countryId: c.id }))
}

export default async function ShopLayout({ children, params }: {
  children: React.ReactNode
  params: Promise<{ countryId: string }>
}) {
  const { countryId } = await params
  return <ShopShell countryId={countryId}>{children}</ShopShell>
}
