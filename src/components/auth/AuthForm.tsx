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
import { useIonRouter } from '@ionic/react';
import { AlertCircle, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Login form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Additional signup form fields
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // Form validation
  const [errors, setErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    general?: string;
  }>({});

  const ionRouter = useIonRouter();
  const { toast } = useToast();

  // Basic validation before submitting
  const validateForm = () => {
    const newErrors: {
      email?: string;
      username?: string;
      password?: string;
    } = {};
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    // Username validation (only for signup)
    if (!isLogin && !username) {
      newErrors.username = 'Username is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      let data;

      if (isLogin) {
        // Login request
        data = await makeHttpCall(`/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            email,
            password,
          }),
        });
      } else {
        // Signup request
        data = await makeHttpCall(`/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            username,
            email,
            password,
            first_name: firstName,
            last_name: lastName,
          }),
        });
      }

      // Show success message
      toast({
        duration: 8000,
        title: isLogin ? 'Welcome back!' : 'Account created',
        description: isLogin
          ? 'You have been successfully logged in.'
          : 'Your account has been created successfully.',
      });

      // Navigate to the home page using Ionic's router
      ionRouter.push('/home');
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors(error);

      // If no specific error was set, set a general error
      if (Object.keys(errors).length === 0) {
        setErrors({
          general:
            error.message || 'An unexpected error occurred. Please try again.',
        });
      }

      toast({
        title: 'Authentication failed',
        description:
          error.message || 'Please check your credentials and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setErrors({});
    if (isLogin) {
      setUsername('');
      setFirstName('');
      setLastName('');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <Card className="w-11/12 max-w-[350px] mb-8">
      <CardHeader>
        <CardTitle className="text-4xl tracking-wide font-smokum font-bold">
          {isLogin ? 'Welcome back' : 'Create account'}
        </CardTitle>
        <CardDescription>
          {isLogin
            ? 'Enter your credentials to continue'
            : 'Sign up for a new account'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errors.general && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label
                  className="text-3xl tracking-wide font-smokum font-bold"
                  htmlFor="username"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  className="text-3xl tracking-wide font-smokum font-bold"
                  htmlFor="firstName"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  className="text-3xl tracking-wide font-smokum font-bold"
                  htmlFor="lastName"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label
              className="text-3xl tracking-wide font-smokum font-bold"
              htmlFor="email"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              className="text-3xl tracking-wide font-smokum font-bold"
              htmlFor="password"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long
              </p>
            )}
          </div>
          {isLogin && (
            <Link to="/reset-password" className="text-sm text-primary">
              Forgot password?
            </Link>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            <LogIn className="mr-2 h-4 w-4" />
            {isLoading
              ? isLogin
                ? 'Signing in...'
                : 'Signing up...'
              : isLogin
              ? 'Sign in'
              : 'Sign up'}
          </Button>
          <Button
            variant="link"
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              resetForm();
            }}
            className="text-sm"
            disabled={isLoading}
          >
            {isLogin
              ? 'Need an account? Sign up'
              : 'Already have an account? Sign in'}
          </Button>
          {/* <IonButton
            expand="block"
            className="flex items-center justify-center space-x-2"
            onClick={() => {
              // Add your Google sign-in logic here
              console.log('Sign in with Google clicked');
            }}
          >
            <IonIcon
              slot="start"
              src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
              className="h-5 w-5"
            />
            <p></p>
            Sign in with Google
            <img
              slot="start"
              src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
              className="h-10 w-10"
            />
          </IonButton> */}
        </CardFooter>
      </form>
    </Card>
  );
};
