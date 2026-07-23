import { prisma } from '@/lib/prisma';
import SettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const setting = await prisma.setting.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });

  // Pass a plain, serialisable object to the client form.
  const data = {
    companyName: setting.companyName,
    adminEmail: setting.adminEmail,
    companyDescEn: setting.companyDescEn,
    companyDescAr: setting.companyDescAr,
    timezone: setting.timezone,
    defaultLanguage: setting.defaultLanguage,
    sessionTimeoutMins: setting.sessionTimeoutMins,
    maxLoginAttempts: setting.maxLoginAttempts,
    emailNotifications: setting.emailNotifications,
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <h1 className="admin-page-title">Settings</h1>
          <p className="admin-page-sub">Manage global site and account settings.</p>
        </div>
      </div>
      <SettingsForm setting={data} />
    </>
  );
}
