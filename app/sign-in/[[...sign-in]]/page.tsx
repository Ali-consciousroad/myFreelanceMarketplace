import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <SignIn 
        afterSignInUrl="/missions"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
            card: 'bg-white dark:bg-gray-800 shadow-lg',
            headerTitle: 'text-gray-900 dark:text-white',
            headerSubtitle: 'text-gray-600 dark:text-gray-300',
            socialButtonsBlockButton: 'border border-gray-200 dark:border-gray-700',
            formFieldInput: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700',
            formFieldLabel: 'text-gray-700 dark:text-gray-300',
            footerActionLink: 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300',
          }
        }}
      />
    </div>
  );
} 