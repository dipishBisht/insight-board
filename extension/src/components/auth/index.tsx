import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';

function Auth() {
    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
                <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Welcome to InsightBoard
                </h1>
                <button
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2 px-6 py-2 rounded-md border border-gray-300 bg-white hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600 transition text-gray-700 dark:text-white font-medium"
                >
                    <img className='size-8' src="/images/google.webp" alt="" />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
}

export default Auth;
