import { prisma } from '@/lib/prisma';
import SettingsForm from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  let setting = await prisma.setting.findUnique({ where: { id: 1 } });
  if (!setting) {
    setting = await prisma.setting.create({ data: { id: 1 } });
  }

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
