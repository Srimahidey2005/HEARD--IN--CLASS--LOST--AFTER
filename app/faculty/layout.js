import {requirePortalUser} from '@/lib/auth';
import DashboardShell from '@/components/DashboardShell';

// This portal is session- and database-dependent, so it must render per request.
export const dynamic = 'force-dynamic';

export default async function Layout({children}){
  const user=await requirePortalUser('faculty');
  return <DashboardShell user={user} role="faculty">{children}</DashboardShell>
}
