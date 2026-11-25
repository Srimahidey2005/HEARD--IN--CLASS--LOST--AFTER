import {requirePortalUser} from '@/lib/auth';
import DashboardShell from '@/components/DashboardShell';

export default async function Layout({children}){
  const user=await requirePortalUser('faculty');
  return <DashboardShell user={user} role="faculty">{children}</DashboardShell>
}
