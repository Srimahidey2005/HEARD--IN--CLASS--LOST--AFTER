import {requirePortalUser} from '@/lib/auth';
import DashboardShell from '@/components/DashboardShell';
import LiveQueryRefresh from '@/components/LiveQueryRefresh';

export default async function Layout({children}){
  const user=await requirePortalUser('student');
  return <><LiveQueryRefresh/><DashboardShell user={user} role="student">{children}</DashboardShell></>
}
