import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/Badge';
import ProfileInfoForm from './profile/ProfileInfoForm';
import ChangePasswordForm from './profile/ChangePasswordForm';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  const roleVariant =
    user.role === 'ADMIN' ? 'danger' : user.role === 'STORE_OWNER' ? 'warning' : 'default';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Profile settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage your account preferences and security credentials
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={roleVariant}>{user.role}</Badge>
          <Badge variant={user.emailVerified ? 'success' : 'warning'}>
            {user.emailVerified ? 'Verified' : 'Unverified'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ProfileInfoForm />
        <ChangePasswordForm />
      </div>
    </div>
  );
}
