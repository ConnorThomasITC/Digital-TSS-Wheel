import { getFullConfig, getWheelSettings } from '@/lib/db';
import Wheel from '@/components/Wheel';

export const revalidate = 0; // Disable caching for fresh data

export default async function WheelPage() {
  const services = getFullConfig();
  const settings = getWheelSettings();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Wheel services={services} settings={settings} />
    </main>
  );
}
