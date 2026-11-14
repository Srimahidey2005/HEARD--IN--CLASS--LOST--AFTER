import {requirePortalUser} from '@/lib/auth';
import DashboardShell from '@/components/DashboardShell';
import LiveQueryRefresh from '@/components/LiveQueryRefresh';

// Dashboard pages depend on the signed-in user and live MongoDB data.
// Never prerender them during `next build`.
export const dynamic = 'force-dynamic';

export default async function Layout({children}){
  const user=await requirePortalUser('student');
  return <><LiveQueryRefresh/><DashboardShell user={user} role="student">{children}</DashboardShell></>
}
