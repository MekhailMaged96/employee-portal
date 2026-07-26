import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center">
      <p className="text-6xl font-bold text-blue-600">403</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">Access denied</h1>
      <p className="mt-2 text-gray-500">You don&apos;t have permission to view this page.</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
