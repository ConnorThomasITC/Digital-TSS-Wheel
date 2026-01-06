import { getFullConfig } from '@/lib/db';
import AdminDashboard from '@/components/AdminDashboard';

export const revalidate = 0;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const services = getFullConfig();
  const key = searchParams.key || null;

  return <AdminDashboard initialServices={services} editKey={key} />;
}
