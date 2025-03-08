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
import { useIonRouter } from '@ionic/react';
import { LogIn } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Backend API URL
const API_URL = 'http://localhost:8000';

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
  const [role, setRole] = useState('regular');
  
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
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      let response;
      
      if (isLogin) {
        // Login request
        response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
      } else {
        // Signup request
        response = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            role: role || 'regular', // Default to regular if not selected
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific error types
        if (errorData.code === 'duplicate_email') {
          setErrors({ email: 'This email is already registered' });
          throw new Error('This email is already registered');
        } else if (errorData.code === 'duplicate_username') {
          setErrors({ username: 'This username is already taken' });
          throw new Error('This username is already taken');
        } else if (errorData.code === 'invalid_credentials') {
          setErrors({ general: 'Invalid email or password' });
          throw new Error('Invalid email or password');
        } else {
          throw new Error(errorData.message || 'Authentication failed');
        }
      }

      const data = await response.json();
      
      // Store the JWT token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Show success message
      toast({
        title: isLogin ? 'Welcome back!' : 'Account created',
        description: isLogin ? 'You have been successfully logged in.' : 'Your account has been created successfully.',
      });

      // Navigate to the home page using Ionic's router
      ionRouter.push('/home');
    } catch (error) {
      console.error('Authentication error:', error);
      
      // If no specific error was set, set a general error
      if (Object.keys(errors).length === 0) {
        setErrors({ 
          general: error.message || 'An unexpected error occurred. Please try again.' 
        });
      }
      
      toast({
        title: 'Authentication failed',
        description: error.message || 'Please check your credentials and try again.',
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
      setRole('regular');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{isLogin ? 'Welcome back' : 'Create account'}</CardTitle>
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
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
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
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={role}
                  onValueChange={setRole}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regular">Regular User</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Select your role in the system. This affects what features you can access.
                </p>
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            {!isLogin && (
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            )}
          </div>
          {isLogin && (
            <Button variant="link" className="px-0 text-sm">
              Forgot password?
            </Button>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            <LogIn className="mr-2 h-4 w-4" />
            {isLoading 
              ? (isLogin ? 'Signing in...' : 'Signing up...') 
              : (isLogin ? 'Sign in' : 'Sign up')}
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
        </CardFooter>
      </form>
    </Card>
  );
};
