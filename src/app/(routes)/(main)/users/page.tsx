import UsersContent from '@/components/features/users/users-content'

export default async function UsersPage() {
  return (
    <div className="page-container">
      <h1 className="header-one">Users</h1>
      <div className="w-full">
        <UsersContent />
      </div>
    </div>
  )
}
