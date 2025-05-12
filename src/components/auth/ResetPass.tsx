import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { makeHttpCall } from '@/utils/makeHttpCall';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

const ResetPass = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const history = useHistory();

  const validateForm = () => {
    const newErrors: { email?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Make API call to send reset token
      await makeHttpCall('/send-reset-password-token', {
        method: 'POST',
        headers: {
          email,
        },
      });

      toast({
        title: 'Reset token sent',
        description:
          'If the email exists in our system, a reset token has been sent to it.',
      });

      // Navigate to the confirmation page with the email
      history.push('/confirm-reset-password', { email });
    } catch (error) {
      console.error('Reset password request error:', error);

      // Handle specific error types
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error.message) {
        if (error.message.includes('Invalid email')) {
          errorMessage = 'The provided email address is not registered.';
        } else if (error.message.includes('Database connection error')) {
          errorMessage =
            'Unable to connect to the server. Please try again later.';
        } else {
          errorMessage = error.message;
        }
      }

      setErrors({
        general: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-11/12 max-w-[350px]'>
        <CardHeader>
          <CardTitle className='text-4xl tracking-wide font-smokum font-bold'>
            Reset Password
          </CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className='space-y-4'>
            {errors.general && (
              <Alert variant='destructive' className='mb-4'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}
            <div className='space-y-2'>
              <Label
                className='text-3xl tracking-wide font-smokum font-bold'
                htmlFor='email'
              >
                Email
              </Label>
              <Input
                id='email'
                type='email'
                placeholder='name@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Token'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPass;
