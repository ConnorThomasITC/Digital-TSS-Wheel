import { getFullConfig } from '@/lib/db';
import Wheel from '@/components/Wheel';

export const revalidate = 0; // Disable caching for fresh data

export default async function WheelPage() {
  const services = getFullConfig();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Wheel services={services} />
    </main>
  );
}
