import {requirePortalUser} from '@/lib/auth';
import DashboardShell from '@/components/DashboardShell';

export default async function Layout({children}){
  const user=await requirePortalUser('admin');
  return <DashboardShell user={user} role="admin">{children}</DashboardShell>
}
