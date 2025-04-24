/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { SignUpFormValues } from '../types/auth.types';

const SignUpForm: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Name must be at least 3 characters')
      .required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/(?=.*[a-zA-Z])/, 'Password must contain at least one letter')
      .matches(/(?=.*\d)/, 'Password must contain at least one number')
      .matches(/(?=.*[@$!%*?&])/, 'Password must contain at least one special character')
      .required('Password is required'),
  });

  const formik = useFormik<SignUpFormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setApiError(null);
        await signUp(values);
        navigate('/app');
      } catch (error: any) {
        setApiError(error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
              sign in to your account
            </Link>
          </p>
        </div>

        {apiError && (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  There was an error signing up:
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{apiError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  formik.touched.name && formik.errors.name
                    ? 'border-red-300 placeholder-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                } text-gray-900 rounded-t-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  formik.touched.email && formik.errors.email
                    ? 'border-red-300 placeholder-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                } text-gray-900 focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-300 placeholder-red-500 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                } text-gray-900 rounded-b-md focus:outline-none focus:z-10 sm:text-sm`}
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
              ) : null}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {formik.isSubmitting ? 'Signing up...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;