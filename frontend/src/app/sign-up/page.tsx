import SignUpForm from './sign-up-form/SignUpForm';
import { Metadata } from 'next';

// Set page-specific metadata
export const metadata: Metadata = {
  title: 'Sign up - Blastey',
  description: 'Create your account on Blastey and start earning points',
};

// Wrap the Trips component with the withAuth HOC
function SignUp() {
  return (
    <main>
        <SignUpForm />
    </main>
  );
}

// Export the wrapped component
export default SignUp;
